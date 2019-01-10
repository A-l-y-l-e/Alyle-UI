import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { isImported, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

export function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}

export function addImport(host: Tree, filePath: string, importModule: string | string[], path: string) {
  let importModules: string[];
  if (typeof importModule === 'string') {
    importModules = [importModule];
  } else {
    importModules = importModule;
  }
  // add import theme
  importModules.forEach((val) => {
    const fileSource = getTsSourceFile(host, filePath);
    const importPath = path;
    if (!isImported(fileSource, val, importPath)) {
      const change = insertImport
      (fileSource, filePath, val, importPath);
      if (change) {
        const recorder = host.beginUpdate(filePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }
  });
}

export function prettierConstructorParameters(host: Tree,
  filePath: string,
  constructor: ts.ConstructorDeclaration): void {
  const parenToken = constructor.getChildren()
    .filter(prop => prop.kind === ts.SyntaxKind.OpenParenToken || prop.kind === ts.SyntaxKind.CloseParenToken);
    // .map(prop => prop.getFullText().trim());
  const buffer = host.read(filePath);

  if (buffer === null) {
    throw new SchematicsException(`Could not read index file: ${filePath}`);
  }

  const syntaxList = constructor.getChildren()
    .filter(prop => prop.kind === ts.SyntaxKind.SyntaxList)[0];
  const contructorBefore =
    `${parenToken[0].getFullText()}${syntaxList.getFullText()}${parenToken[1].getFullText()}`;
  const parameters = syntaxList.getChildren()
    .filter(prop => prop.kind === ts.SyntaxKind.Parameter)
    .map((parameter: ts.ParameterDeclaration, index) => {
      const param = parameter.getText();
      let comment = parameter.getFullText().replace(param, '').trim();
      if (comment) {
        comment += `\n`;
        if (index === 0) {
          comment += `\n${comment}`;
        }
      }
      return `${comment}${param}`;
    });
  const parametersStr = parameters.join(`,\n${` `.repeat(14)}`);
  const result =
    `${parenToken[0].getFullText().trim()}${parametersStr}${parenToken[1].getFullText().trim()}`;
  host.overwrite(filePath, buffer.toString().replace(contructorBefore, result));
}
