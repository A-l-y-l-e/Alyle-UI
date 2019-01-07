import * as inquirer from 'inquirer';
import * as semver from 'semver';
import { strings } from '@angular-devkit/core';
import * as ts from '@schematics/angular/node_modules/typescript';
import { addSymbolToNgModuleMetadata, insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getProjectTargets, targetBuildNotFoundError } from '@schematics/angular/utility/project-targets';
import { InsertChange } from '@schematics/angular/utility/change';
import { join } from 'path';
import { Observable } from 'rxjs';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
  } from '@angular-devkit/schematics';
import { Schema } from './schema';

checkVersionAngularCLI();

function checkVersionAngularCLI() {
  const version = require(join(process.cwd(), 'package.json')).devDependencies['@angular/cli'];
  if (!semver.satisfies(semver.coerce(version)!, '>=7.2.0-rc.0 || 7.2.x')) {
    throw new SchematicsException(`Alyle UI Schematics require "@angular/cli@>=7.2.0-rc.0 || 7.2.x"`);
  }
}

function updateAppModule(host: Tree, _context: SchematicContext, options: any, themeName: string, themes: string[]) {
  _context.logger.debug('Updating appmodule');
  // find app module
  const projectTargets = getProjectTargets(host, options.project);
  if (!projectTargets.build) {
    throw targetBuildNotFoundError();
  }

  const mainPath = projectTargets.build.options.main;
  const modulePath = getAppModulePath(host, mainPath);
  _context.logger.debug(`module path: ${modulePath}`);

  // add import animations
  let moduleSource = getTsSourceFile(host, modulePath);
  let importModule = 'BrowserAnimationsModule';
  let importPath = '@angular/platform-browser/animations';
  if (!isImported(moduleSource, importModule, importPath)) {
    const change = insertImport
    (moduleSource, modulePath, importModule, importPath);
    if (change) {
      const recorder = host.beginUpdate(modulePath);
      recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
      host.commitUpdate(recorder);
    }
  }

  // register animations in app module
  moduleSource = getTsSourceFile(host, modulePath);
  let metadataChanges = addSymbolToNgModuleMetadata(
    moduleSource, modulePath, 'imports', importModule);
  if (metadataChanges) {
    const recorder = host.beginUpdate(modulePath);
    metadataChanges.forEach((change: InsertChange) => {
      recorder.insertRight(change.pos, change.toAdd);
    });
    host.commitUpdate(recorder);
  }

  // add import theme
  ['LyThemeModule', 'LY_THEME'].forEach((_import) => {
    moduleSource = getTsSourceFile(host, modulePath);
    importModule = _import;
    importPath = '@alyle/ui';
    if (!isImported(moduleSource, importModule, importPath)) {
      const change = insertImport
      (moduleSource, modulePath, importModule, importPath);
      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }
  });

  // register theme in app module
  const importText = `LyThemeModule.setTheme('${themeName}')`;
  moduleSource = getTsSourceFile(host, modulePath);
  metadataChanges = addSymbolToNgModuleMetadata(
    moduleSource, modulePath, 'imports', importText);
  if (!moduleSource.text.includes('LyThemeModule.setTheme') && metadataChanges) {
    const recorder = host.beginUpdate(modulePath);
    metadataChanges.forEach((change: InsertChange) => {
      recorder.insertRight(change.pos, change.toAdd);
    });
    host.commitUpdate(recorder);
  }

  themes.forEach(_themeName => {
    const [themePath] = _themeName.split('-');
    // register providers
    moduleSource = getTsSourceFile(host, modulePath);
    const simbolName = `{ provide: LY_THEME, useClass: ${strings.classify(_themeName)}, multi: true }`;
    metadataChanges = addSymbolToNgModuleMetadata(
      moduleSource, modulePath, 'providers', simbolName);
    if (metadataChanges) {
      const recorder = host.beginUpdate(modulePath);
      metadataChanges.forEach((change: InsertChange) => {
        recorder.insertRight(change.pos, change.toAdd);
      });
      host.commitUpdate(recorder);
    }

    // add import themes
    moduleSource = getTsSourceFile(host, modulePath);
    importModule = strings.classify(_themeName);
    importPath = `@alyle/ui/themes/${themePath}`;
    if (!isImported(moduleSource, importModule, importPath)) {
      const change = insertImport
      (moduleSource, modulePath, importModule, importPath);
      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }
  });
}

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function setUpAppModule(_options: Schema): Rule {
  return (host: Tree, _context: SchematicContext) => {
    return new Observable((_) => {
      if (_options.themes.length > 1) {
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'selectedTheme',
            message: 'Set Theme',
            choices: _options.themes
          },
        ])
        .then(({selectedTheme}: { selectedTheme: string }) => {
          const themes = _options.themes;
          updateAppModule(host, _context, _options, selectedTheme, themes);
          _.next(host);
          _.complete();
        });
      } else {
        const selectedTheme = [...(_options.themes as string[]), 'minima-light'][0];
        updateAppModule(host, _context, _options, selectedTheme, [selectedTheme]);
        _.next(host);
        _.complete();
      }
    });
  };
}
