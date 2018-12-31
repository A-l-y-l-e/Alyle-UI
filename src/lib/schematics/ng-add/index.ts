import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

const PKG = '@alyle/ui';
const AUI_VERSION = require(`${PKG}/package.json`).version;

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);
      json.dependencies[PKG] = AUI_VERSION;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }
    _context.addTask(new NodePackageInstallTask());
  };
}

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: object) {
  return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
}
