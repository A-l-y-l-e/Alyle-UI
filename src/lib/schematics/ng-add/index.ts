import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addHammerJsToMain } from './gestures';
import { Schema } from './schema';
import { setUpAppModule } from './set-up';

const AUI_VERSION = require(`@alyle/ui/package.json`).version;
const ANGULAR_CORE_VERSION = require(`@angular/core/package.json`).version;
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
function addPkg(tree: Tree, pkgName: string, version: string) {
  if (tree.exists(pkgName)) {
    const sourceText = tree.read(pkgName)!.toString('utf-8');
    const json = JSON.parse(sourceText);
    json.dependencies[pkgName] = version;
    json.dependencies = sortObjectByKeys(json.dependencies);
  }
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addPkg(tree, '@angular/animations', ANGULAR_CORE_VERSION);
    addPkg(tree, '@alyle/ui', AUI_VERSION);
    addPkg(tree, 'chroma-js', CHROMA_JS_VERSION);
    if (_options.gestures) {
      addPkg(tree, 'hammerjs', HAMMERJS_VERSION);
      addHammerJsToMain(_options);
    }
    return chain([setUpAppModule(_options)]);
  };
}
