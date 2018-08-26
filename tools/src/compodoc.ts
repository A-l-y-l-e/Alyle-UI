import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { PackageConf } from './config/package.conf';
import { join } from 'path';


const { components } = PackageConf;

for (const key in components) {
  if (components.hasOwnProperty(key)) {
    const pathFolder = components[key];
    console.log(key);
    const docPathFolder = join('src/api', key);
    const ls = spawnSync(
      'yarn',
      [
        'compodoc',
        join('src/lib', pathFolder),
        '--output', docPathFolder,
        '--name', key,
        '--tsconfig', 'tsconfig.json',
        '--disableSourceCode',
        '--disablePrivate',
        '--disableLifeCycleHooks',
        '--disableCoverage',
        '--silent',
        '--exportFormat', 'json'
      ],
      {stdio: 'inherit'}
    );

    if (ls.status) {
      process.exit(1);
    }
    const docPathFile = join(docPathFolder, 'documentation.json');
    const fileObject = JSON.parse(readFileSync(docPathFile, 'utf8').toString());
    removeKeys(fileObject, ['sourceCode']);
    removeKeys(fileObject, ['constructorObj']);
    writeFileSync(docPathFile, JSON.stringify(fileObject), 'utf8');

  }
}

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
function removeKeys(obj, keys: string[]) {
  let index;
  for (const prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if (obj.hasOwnProperty(prop)) {
          switch (typeof(obj[prop])) {
              case 'string':
                  index = keys.indexOf(prop);
                  if (index > -1) {
                      delete obj[prop];
                  }
                  break;
              case 'object':
                  index = keys.indexOf(prop);
                  if (index > -1) {
                      delete obj[prop];
                  } else {
                      removeKeys(obj[prop], keys);
                  }
                  break;
          }
      }
  }
}
