import { Tree } from '@angular-devkit/schematics';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getDecoratorMetadata, findNode } from './vendored-ast-utils';
import * as ts from 'typescript';
import { dirname } from 'path';
import { normalize } from '@angular-devkit/core';
import { getTsSourceFile } from './ast';
import { Schema } from '../ng-add/schema';
import { getProjectFromWorkspace, getProjectMainFile } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

export function getAppComponentPath(host: Tree, options: Schema) {
  const workspace = getWorkspace(host);
  const project = getProjectFromWorkspace(workspace, options.project);
  const mainPath = getProjectMainFile(project);
  const modulePath = getAppModulePath(host, mainPath);
  const moduleSource = getTsSourceFile(host, modulePath);
  const decoratorMetadata = getDecoratorMetadata(moduleSource, 'NgModule', '@angular/core');
  const propertyName = 'bootstrap';
  const { properties } = decoratorMetadata[0] as ts.ObjectLiteralExpression;
  const property = properties
  .filter(prop => prop.kind === ts.SyntaxKind.PropertyAssignment)
  .filter((prop: ts.PropertyAssignment) => {
    const name = prop.name;
    switch (name.kind) {
      case ts.SyntaxKind.Identifier:
        return (name as ts.Identifier).getText() === propertyName;
      case ts.SyntaxKind.StringLiteral:
        return (name as ts.StringLiteral).text === propertyName;
    }

    return false;
  })[0];
  const bootstrapValue = ((property as ts.PropertyAssignment).initializer.getText()).split(/\[|\]|\,\s?/g).filter(s => s)[0];
  const appComponentPath = moduleSource.statements
  .filter(prop => prop.kind === ts.SyntaxKind.ImportDeclaration)
  .filter(prop => findNode(prop, ts.SyntaxKind.ImportSpecifier, bootstrapValue))
  .map(({ moduleSpecifier }: ts.ImportDeclaration) => (moduleSpecifier as ts.StringLiteral).text)[0];

  const mainDir = dirname(modulePath);
  return normalize(`/${mainDir}/${appComponentPath}.ts`);
}
