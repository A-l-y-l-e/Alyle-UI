import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { join } from 'path';
import { addHammerJsToMain } from './gestures';
import { Schema } from './schema';
import { setUpAppModule } from './set-up';

const AUI_VERSION = require(`@alyle/ui/package.json`).version;
const ANGULAR_CORE_VERSION = require(join(process.cwd(), 'package.json')).dependencies['@angular/core'];
const HAMMERJS_VERSION = '^2.0.8';
const CHROMA_JS_VERSION = '^1.3.6';

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

function installPkgs(_options: Schema): Rule {
  return (host: Tree, _context: SchematicContext) => {
    addPkg(host, '@angular/animations', ANGULAR_CORE_VERSION);
    addPkg(host, '@alyle/ui', `^${AUI_VERSION}`);
    addPkg(host, 'chroma-js', CHROMA_JS_VERSION);
    if (_options.gestures) {
      addPkg(host, 'hammerjs', HAMMERJS_VERSION);
    }
    _context.addTask(new NodePackageInstallTask());
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: Schema): Rule {
  return chain([
    addHammerJsToMain(_options),
    setUpAppModule(_options),
    installPkgs(_options)
  ]);
}
