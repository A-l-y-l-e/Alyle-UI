import * as ts from '@schematics/angular/node_modules/typescript';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { getProjectTargets, targetBuildNotFoundError } from '@schematics/angular/utility/project-targets';
import { addImport, getTsSourceFile, prettierConstructorParameters } from '../utils/ast';
import { findNodes } from '@schematics/angular/utility/ast-utils';

/** Adds the styles to the src/app/app.component.ts file. */
export function setUpStyles(options: Schema, filePath: string): (host: Tree) => Tree {
  return (host: Tree) => {
    const projectTargets = getProjectTargets(host, options.project);

    if (!projectTargets.build) {
      throw targetBuildNotFoundError();
    }

    const buffer = host.read(filePath);

    if (buffer === null) {
      throw new SchematicsException(`Could not read index file: ${filePath}`);
    }

    // add import style
    addImport(host, filePath, ['LyTheme2', 'ThemeVariables'], '@alyle/ui');

    let component = getComponentOrDirective(host, filePath);
    const componentStartPos = component.decorators![0].pos;

    const recorder = host.beginUpdate(filePath);
    recorder.insertLeft(componentStartPos, `\n\nconst STYLES = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});`);
    host.commitUpdate(recorder);

    component = getComponentOrDirective(host, filePath);

    const hasConstructor = component.members
      .some(prop => (prop.kind === ts.SyntaxKind.Constructor) && !!(prop as ts.ConstructorDeclaration).body);
    let constructor: ts.ConstructorDeclaration;
    let __recorder = host.beginUpdate(filePath);
    const propertyValue = `\n  readonly classes = this.theme.addStyleSheet(STYLES);\n`;
    const constructorCall = `  constructor(\n    private theme: LyTheme2\n  ) { }\n`;
    const OpenBraceTokenPos = findNodes(component, ts.SyntaxKind.OpenBraceToken)
    .filter(prop => prop.parent === component).map(prop => prop.end)[0];

    __recorder.insertLeft(OpenBraceTokenPos, propertyValue);
    host.commitUpdate(__recorder);
    __recorder = host.beginUpdate(filePath);


    component = getComponentOrDirective(host, filePath);

    if (hasConstructor) {
      constructor = getContructor(component);

      const pos = findNodes(constructor, ts.SyntaxKind.OpenParenToken)
      .filter(prop => prop.parent === constructor).map(prop => prop.end)[0];

      if (constructor.parameters.length) {
        __recorder.insertLeft(pos, `\n    private theme: LyTheme2,\n  `);
      } else {
        __recorder.insertLeft(pos, `\n    private theme: LyTheme2\n  `);
      }
    } else if (component.members.length) {
      const latestPropertyDeclarationEnd = component.members
        .filter(prop => prop.kind === ts.SyntaxKind.PropertyDeclaration)
        .map(({ end }: ts.PropertyDeclaration) => end).reverse()[0];
      __recorder.insertLeft(latestPropertyDeclarationEnd, `\n\n${constructorCall}`);
    } else {
      __recorder.insertLeft(OpenBraceTokenPos, constructorCall);
    }
    host.commitUpdate(__recorder);

    component = getComponentOrDirective(host, filePath);
    constructor = getContructor(component);

    prettierConstructorParameters(host, filePath, constructor);

    return host;
  };
}

function getComponentOrDirective(host: Tree, filePath: string) {
  const fileSource = getTsSourceFile(host, filePath);
  return findNodes(fileSource, ts.SyntaxKind.ClassDeclaration, 1)
    .filter(prop => prop.decorators)
    .filter(prop => prop.decorators!.filter(
      decorator => decorator.getText().startsWith('@Component') ||
      decorator.getText().startsWith('@Directive')
    ))[0] as ts.ClassDeclaration;
}

function getContructor(componentOrDirective: ts.ClassDeclaration) {
  return (componentOrDirective.members
    .filter(prop => prop.kind === ts.SyntaxKind.Constructor)[0] as ts.ConstructorDeclaration);
}
