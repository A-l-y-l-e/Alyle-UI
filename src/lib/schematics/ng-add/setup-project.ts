import { strings } from '@angular-devkit/core';
import * as ts from 'typescript';
import { insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  getAppModulePath,
  addModuleImportToModule,
  addSymbolToNgModuleMetadata,
  getProjectMainFile,
  getProjectFromWorkspace
} from '@angular/cdk/schematics';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain
  } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { addHammerJsToMain } from './gestures';
import { addFontsToIndex } from './fonts';
import { setUpStyles } from '../utils/styles';

function updateAppModule(options: Schema) {
  return (host: Tree, _context: SchematicContext) => {
    _context.logger.debug('Updating appmodule');

    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const themes = options.themes.length ? options.themes : ['minima-light'];
    const theme = options.themes[0];

    const mainPath = getProjectMainFile(project);
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
    ['LyThemeModule', 'LY_THEME', 'LY_THEME_NAME'].forEach((_import) => {
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
    // const importText = `LyThemeModule.setTheme('${theme}')`;
    // moduleSource = getTsSourceFile(host, modulePath);
    // metadataChanges = addSymbolToNgModuleMetadata(
    //   moduleSource, modulePath, 'imports', importText);
    // if (!moduleSource.text.includes('LyThemeModule.setTheme') && metadataChanges) {
    //   const recorder = host.beginUpdate(modulePath);
    //   metadataChanges.forEach((change: InsertChange) => {
    //     recorder.insertRight(change.pos, change.toAdd);
    //   });
    //   host.commitUpdate(recorder);
    // }

    // register HammerModule in app module
    addModuleImportToModule(host, modulePath, 'HammerModule', '@angular/platform-browser');

    // set theme
    moduleSource = getTsSourceFile(host, modulePath);
    const themeSimbolName = `{ provide: LY_THEME_NAME, useValue: '${theme}' }`;
    metadataChanges = addSymbolToNgModuleMetadata(
      moduleSource, modulePath, 'providers', themeSimbolName);
    if (metadataChanges) {
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
  };
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

const STYLES = `\n\nconst STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $global: lyl \`{
      body {
        background-color: \${theme.background.default}
        color: \${theme.text.default}
        font-family: \${theme.typography.fontFamily}
        margin: 0
        direction: \${theme.direction}
      }
    }\`,
    root: lyl \`{
      display: block
    }\`
  };
};`;

export default function (options: Schema): Rule {
  return chain([
    addHammerJsToMain(options),
    updateAppModule(options),
    addFontsToIndex(options),
    setUpStyles(options, undefined, undefined, STYLES),
  ]);
}
