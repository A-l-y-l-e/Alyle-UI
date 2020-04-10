import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { isImported, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { getDecoratorMetadata, getMetadataField, parseSourceFile } from '@angular/cdk/schematics';

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

export function addSymbolToDecoratorMetadata(
  source: ts.SourceFile,
  ngModulePath: string,
  decorator: string,
  metadataField: string,
  symbolName: string,
  importPath: string | null = null,
): Change[] {
  const nodes = getDecoratorMetadata(source, decorator, '@angular/core');
  let node: any = nodes[0];  // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  // Get all the children property assignment of object literals.
  const matchingProperties = getMetadataField(
    node as ts.ObjectLiteralExpression,
    metadataField,
  );

  // Get the last node of the array literal.
  if (!matchingProperties) {
    return [];
  }
  // tslint:disable-next-line: triple-equals
  if (matchingProperties.length == 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    // tslint:disable-next-line: no-shadowed-variable
    let position: number;
    // tslint:disable-next-line: no-shadowed-variable
    let toInsert: string;
    // tslint:disable-next-line: triple-equals
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${metadataField}: [${symbolName}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      const matches = text.match(/^\r?\n\s*/);
      if (matches && matches.length > 0) {
        toInsert = `,${matches[0]}${metadataField}: [${symbolName}]`;
      } else {
        toInsert = `, ${metadataField}: [${symbolName}]`;
      }
    }
    if (importPath !== null) {
      return [
        new InsertChange(ngModulePath, position, toInsert),
        insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
      ];
    } else {
      return [new InsertChange(ngModulePath, position, toInsert)];
    }
  }
  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  // If it's not an array, nothing we can do really.
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
  // tslint:disable-next-line: triple-equals
  if (arrLiteral.elements.length == 0) {
    // Forward the property.
    node = arrLiteral;
  } else {
    node = arrLiteral.elements;
  }

  if (!node) {
    // tslint:disable-next-line: no-console
    console.error('No app module found. Please add your new class to your component.');

    return [];
  }

  if (Array.isArray(node)) {
    const nodeArray = node as {} as Array<ts.Node>;
    // tslint:disable-next-line: no-shadowed-variable
    const symbolsArray = nodeArray.map(node => node.getText());
    if (symbolsArray.includes(symbolName)) {
      return [];
    }

    node = node[node.length - 1];
  }

  let toInsert: string;
  let position = node.getEnd();
  // tslint:disable-next-line: triple-equals
  if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
    // We haven't found the field in the metadata declaration. Insert a new
    // field.
    const expr = node as ts.ObjectLiteralExpression;
    // tslint:disable-next-line: triple-equals
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${symbolName}\n`;
    } else {
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match(/^\r?\r?\n/)) {
        toInsert = `,${text.match(/^\r?\n\s*/)[0]}${symbolName}`;
      } else {
        toInsert = `, ${symbolName}`;
      }
    }
  // tslint:disable-next-line: triple-equals
  } else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
    // We found the field but it's empty. Insert it just before the `]`.
    position--;
    toInsert = `${symbolName}`;
  } else {
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    if (text.match(/^\r?\n/)) {
      toInsert = `,${text.match(/^\r?\n(\r?)\s*/)[0]}${symbolName}`;
    } else {
      toInsert = `, ${symbolName}`;
    }
  }
  if (importPath !== null) {
    return [
      new InsertChange(ngModulePath, position, toInsert),
      insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
    ];
  }

  return [new InsertChange(ngModulePath, position, toInsert)];
}

/**
 * Custom function to insert a provider into Decorator. It also imports it.
 */
export function addProviderDecorator(source: ts.SourceFile,
  modulePath: string, decorator: string, classifiedName: string,
  importPath: string): Change[] {
  return addSymbolToDecoratorMetadata(source, modulePath, decorator, 'providers', classifiedName, importPath);
}

export function addProvider(host: Tree, modulePath: string, decorator: string, classifiedName: string,
  src: string) {

  const moduleSource = parseSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addProviderDecorator(moduleSource, modulePath, decorator, classifiedName, src);
  const recorder = host.beginUpdate(modulePath);

  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}
