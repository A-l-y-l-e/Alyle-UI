import { readdirSync, statSync, readFileSync } from 'fs';
import { writeFileSync, removeSync, copySync, pathExists, pathExistsSync } from 'fs-extra';
import { spawnSync } from 'child_process';
import { join } from 'path';
const version = `1.7.0-beta.0`;
const dirLib = `${process.cwd()}/src/lib`;
const dist = `${process.cwd()}/dist/lib`;

const angularCliConfig = JSON.parse(readFileSync(`${process.cwd()}/angular.json`, 'utf8').toString());
const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString());

if (pathExistsSync(dist)) {
  removeSync(dist);
}
const libs: { path: string, pkgName: string }[] = readdirSync(dirLib)
.filter(path => statSync(`${dirLib}/${path}`).isDirectory())
.map(path => {
  const pkgName = join('@alyle/ui', path !== 'core' ? path : '');
  return { path, pkgName };
})
.sort((a, b) => a.pkgName > b.pkgName ? 1 : -1);

/** copy sources */
copySync(dirLib, dist);

libs.forEach(lib => {
  const item = statSync(`${dirLib}/${lib.path}`);
  [
    'ng-package.json',
    'ng-package.prod.json',
    'package.json'
  ].forEach(pkgConfig => {
    const file = readFileSync(`${dist}/${pkgConfig}`, 'utf8').toString()
    .replace(/{name}/g, lib.pkgName)
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
libs.forEach((lib) => {
  previousBuild = previousBuild.then(_ => {
    const ls = spawnSync('ng', ['build', lib.pkgName, '--prod'], {stdio: 'inherit'});
    console.log('ls.status', ls.status);
    copySync(join(`${process.cwd()}/dist`, lib.pkgName), `${process.cwd()}/dist/node_modules/${lib.pkgName}`);
    // const ls = spawnSync('yarn ', ['build', '@alyle/ui'], {stdio: 'inherit'});
  });
});

// pkg['scripts']['build:@alyle/ui'] = scripts;
// writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, undefined, 2), 'utf8');
