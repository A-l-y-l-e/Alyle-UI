import { strings } from '@angular-devkit/core';
import * as ts from 'typescript';
import { addSymbolToNgModuleMetadata, insertImport, isImported } from '../utils/vendored-ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  findModuleFromOptions,
  parseSourceFile,
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
import { addProvider } from '../utils/ast';

function updateAppModule(options: Schema) {
  return async (host: Tree, _context: SchematicContext) => {
    _context.logger.debug('Updating appmodule');
    
    const themes = options.themes.length ? options.themes : ['minima-light'];
    const theme = options.themes[0];
    
    const modulePath = (await findModuleFromOptions(host, options))!;
    _context.logger.debug(`module path: ${modulePath}`);


    // add `import { BrowserAnimationsModule } ...`
    let moduleSource = parseSourceFile(host, modulePath);
    const browserAnimationsModuleName = 'BrowserAnimationsModule';
    let importPath = '@angular/platform-browser/animations';
    if (!isImported(moduleSource, browserAnimationsModuleName, importPath)) {
      const change = insertImport
      (moduleSource, modulePath, browserAnimationsModuleName, importPath);
      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    // add `imports: [ BrowserAnimationsModule ] ...`
    moduleSource = parseSourceFile(host, modulePath);
    let metadataChanges = addSymbolToNgModuleMetadata(
      moduleSource, modulePath, 'imports', browserAnimationsModuleName);
    if (metadataChanges) {
      const recorder = host.beginUpdate(modulePath);
      metadataChanges.forEach((change: InsertChange) => {
        recorder.insertRight(change.pos, change.toAdd);
      });
      host.commitUpdate(recorder);
    }


    // add `import { HammerModuleName } ...`
    moduleSource = parseSourceFile(host, modulePath);
    const HammerModuleName = 'HammerModuleName';
    const HammerModuleImportPath = '@angular/platform-browser/animations';
    if (!isImported(moduleSource, HammerModuleName, HammerModuleImportPath)) {
      const change = insertImport
      (moduleSource, modulePath, HammerModuleName, HammerModuleImportPath);
      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    // add `imports: [ HammerModuleName ] ...`
    moduleSource = parseSourceFile(host, modulePath);
    metadataChanges = addSymbolToNgModuleMetadata(
      moduleSource, modulePath, 'imports', HammerModuleName);
    if (metadataChanges) {
      const recorder = host.beginUpdate(modulePath);
      metadataChanges.forEach((change: InsertChange) => {
        recorder.insertRight(change.pos, change.toAdd);
      });
      host.commitUpdate(recorder);
    }


    // add import theme
    ['LY_THEME', 'LY_THEME_NAME'].forEach((_import) => {
      moduleSource = parseSourceFile(host, modulePath);
      const importModule = _import;
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

    

    [
      'StyleRenderer',
      'LyTheme2'
    ].forEach(provider => {
      addProvider(host, modulePath, 'NgModule', provider, '@alyle/ui');
    });

    // set theme
    moduleSource = parseSourceFile(host, modulePath);
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
      const importModuleThemeName = strings.classify(_themeName);
      importPath = `@alyle/ui/themes/${themePath}`;
      if (!isImported(moduleSource, importModuleThemeName, importPath)) {
        const change = insertImport
        (moduleSource, modulePath, importModuleThemeName, importPath);
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
