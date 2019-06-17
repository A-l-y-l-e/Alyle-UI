import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { join } from 'path';
import { addHammerJsToMain } from './gestures';
import { Schema } from './schema';
import { setUpAppModule } from './set-up';
import { addFontsToIndex } from './fonts';
import { getAppComponentPath } from '../utils/get-app-component-path';
import { setUpStyles } from '../utils/styles';
import { getDefaultProjectName } from '../utils/get-project-name';

let AUI_VERSION: string;
try {
  AUI_VERSION = require(`@alyle/ui/package.json`).version;
} catch (error) {
  AUI_VERSION = '*';
}

let ANGULAR_CORE_VERSION: string;
try {
  ANGULAR_CORE_VERSION = require(join(process.cwd(), 'package.json')).dependencies['@angular/core'];
} catch (error) {
  ANGULAR_CORE_VERSION = '*';
}
const HAMMERJS_VERSION = '^2.0.8';
const CHROMA_JS_VERSION = '^2.0.2';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: object) {
  return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
}

/** Add package */
function addPkg(host: Tree, pkgName: string, version: string) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    json.dependencies[pkgName] = version;
    json.dependencies = sortObjectByKeys(json.dependencies);
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }
}

function installPkgs(options: Schema): Rule {
  return (host: Tree, _context: SchematicContext) => {
    _context.logger.debug('installPkgs');
    addPkg(host, '@angular/animations', ANGULAR_CORE_VERSION);
    addPkg(host, '@alyle/ui', `^${AUI_VERSION}`);
    addPkg(host, 'chroma-js', CHROMA_JS_VERSION);
    if (options.gestures) {
      addPkg(host, 'hammerjs', HAMMERJS_VERSION);
    }
    _context.addTask(new NodePackageInstallTask());
  };
}

export default function (options: Schema): Rule {
  const STYLES = `\n\nconst STYLES = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});`;
  return (host: Tree) => {
    options.project = options.project || getDefaultProjectName(host);
    return chain([
      addHammerJsToMain(options),
      setUpAppModule(options),
      addFontsToIndex(options),
      setUpStyles(options, getAppComponentPath(host, options), STYLES),
      installPkgs(options)
    ]);
  };
}
