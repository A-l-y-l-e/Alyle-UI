import { readdirSync, statSync, readFileSync } from 'fs';
import { writeFileSync, removeSync, copySync, pathExists, pathExistsSync } from 'fs-extra';
import { spawnSync } from 'child_process';
import { join } from 'path';
import * as jsyaml from 'js-yaml';
import * as camelCase from 'camelcase';

const version = `1.7.0-beta.8`;
const dirLib = `${process.cwd()}/src/lib`;
const dist = `${process.cwd()}/dist/lib`;

const angularCliConfig = JSON.parse(readFileSync(`${process.cwd()}/angular.json`, 'utf8').toString());
const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString());
let components: { path: string, pkgName: string }[] = jsyaml.load(readFileSync(`${process.cwd()}/.components.yml`, 'utf8').toString());
if (pathExistsSync(dist)) {
  console.log('cleaning...');
  removeSync(dist);
  removeSync(`${process.cwd()}/dist/node_modules`);
  removeSync(`${process.cwd()}/dist/@alyle`);
}
components = Object.keys(components).map((pkgName) => ({ path: components[pkgName], pkgName }));

/** copy sources */
copySync(dirLib, dist);
copySync(`${dirLib}/README.md`, `${process.cwd()}/dist/@alyle/ui/README.md`);
copySync(`${dirLib}/.npmignore`, `${process.cwd()}/dist/@alyle/ui/.npmignore`);

/** Update version */

function updateVersion() {
  const fileName = `${dist}/core/src/version.ts`;
  const file = readFileSync(fileName, 'utf8').toString()
  .replace(/{\sversion\s}/g, version);
  writeFileSync(fileName, file, 'utf8');
}

updateVersion();

components.forEach(lib => {
  const item = statSync(`${dirLib}/${lib.path}`);
  [
    'ng-package.json',
    'ng-package.prod.json',
    'package.json'
  ].forEach(pkgConfig => {
    const file = readFileSync(`${dist}/${pkgConfig}`, 'utf8').toString()
    .replace(/{name}/g, lib.pkgName)
    .replace(/{id}/g, camelCase(lib.path))
    .replace(/{version}/g, version);
    writeFileSync(`${dist}/${lib.path}/${pkgConfig}`, file, 'utf8');
    angularCliConfig['projects'][lib.pkgName] = {
      'root': `dist/lib/${lib.path}`,
      'projectType': 'library',
      'prefix': 'ly',
      'architect': {
        'build': {
          'builder': '@angular-devkit/build-ng-packagr:build',
          'options': {
            'project': `dist/lib/${lib.path}/ng-package.json`
          },
          'configurations': {
            'production': {
              'project': `dist/lib/${lib.path}/ng-package.prod.json`
            }
          }
        },
        'test': {
          'builder': '@angular-devkit/build-angular:karma',
          'options': {
            'main': `dist/lib/${lib.path}/src/test.ts`,
            'tsConfig': `dist/lib/${lib.path}/tsconfig.spec.json`,
            'karmaConfig': `dist/lib/${lib.path}/karma.conf.js`
          }
        },
        'lint': {
          'builder': '@angular-devkit/build-angular:tslint',
          'options': {
            'tsConfig': [
              `dist/lib/${lib.path}/tsconfig.lint.json`,
              `dist/lib/${lib.path}/tsconfig.spec.json`
            ],
            'exclude': [
              '**/node_modules/**'
            ]
          }
        }
      }
    };
    writeFileSync(`${process.cwd()}/angular.json`, JSON.stringify(angularCliConfig, undefined, 2), 'utf8');
  });
});

/** build */
let previousBuild = Promise.resolve();
components.forEach((lib) => {
  previousBuild = previousBuild.then(_ => {
    const ls = spawnSync('ng', ['build', lib.pkgName, '--prod'], {stdio: 'inherit'});
    if (ls.status) {
      process.exit(1);
    }
    copySync(join(`${process.cwd()}/dist`, lib.pkgName), `${process.cwd()}/dist/node_modules/${lib.pkgName}`);
  });
});
