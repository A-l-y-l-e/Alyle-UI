import { readdirSync, statSync, readFileSync } from 'fs';
import { writeFileSync, removeSync, copySync, pathExists, pathExistsSync } from 'fs-extra';
import { spawnSync } from 'child_process';
import { join } from 'path';
import * as camelCase from 'camelcase';
import { tslintConfig } from './config/tslint-config';
import { tsConfigSpec } from './config/tsconfig-spec';
import { testConfig } from './config/test-config';
import { karmaConf } from './config/karma.conf';
import { PackageConf } from './config/package.conf';

const dirSrc = `${process.cwd()}/src`;
const dirLib = `${process.cwd()}/src/lib`;
const dist = `${process.cwd()}/dist/lib`;
const angularCliConfig = JSON.parse(readFileSync(`${process.cwd()}/angular.json`, 'utf8').toString());
const version = PackageConf.version;
const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString());
let components: { path: string, pkgName: string }[] = PackageConf.components;
if (pathExistsSync(dist)) {
  console.log('cleaning...');
  removeSync(dist);
  removeSync(`${process.cwd()}/dist/node_modules`);
  removeSync(`${process.cwd()}/dist/@alyle`);
}
components = Object.keys(components).map((pkgName) => ({ path: components[pkgName], pkgName }));

/** copy sources */
copySync(dirLib, dist);

components.forEach((lib, index) => {
  if (index) {
    writeFileSync(`${dist}/${lib.path}/package.json`, `{"ngPackage": {"lib": {"entryFile": "public_api.ts"}}}`, 'utf8');
  }
  // const item = statSync(`${dirLib}/${lib.path}`);
  const nh = lib.path.split('/').map(() => '../').join('');
  // const ngPackagePath = join('../', nh, lib.pkgName);
  // [
  //   'ng-package.json',
  //   'ng-package.prod.json',
  //   'package.json'
  // ].forEach(pkgConfig => {
  //   const file = readFileSync(`${dist}/${pkgConfig}`, 'utf8').toString()
  //   .replace(/{name}/g, ngPackagePath)
  //   .replace(/{packageName}/g, lib.pkgName)
  //   .replace(/{id}/g, camelCase(lib.path))
  //   .replace(/{version}/g, version);
  //   writeFileSync(`${dist}/${lib.path}/${pkgConfig}`, file, 'utf8');
  // });
  const libPath = join(nh, '..', '..', 'src/lib', lib.path);
  /** copy test.ts */
  writeFileSync(`${dist}/${lib.path}/test.ts`, testConfig.replace('{libPath}', `${libPath}`), 'utf8');
  writeFileSync(`${dist}/${lib.path}/karma.conf.js`, karmaConf.replace('{name}', `${lib.path}`), 'utf8');
  writeFileSync(`${dist}/${lib.path}/tslint.json`, JSON.stringify(tslintConfig, undefined, 2), 'utf8');
  tsConfigSpec.include = [
    `${libPath}/**/*.spec.ts`,
    `${libPath}/**/*.d.ts`
  ];
  writeFileSync(`${dist}/${lib.path}/tsconfig.spec.json`, JSON.stringify(tsConfigSpec, undefined, 2), 'utf8');
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
          'main': `dist/lib/${lib.path}/test.ts`,
          'tsConfig': `dist/lib/${lib.path}/tsconfig.spec.json`,
          'karmaConfig': `dist/lib/${lib.path}/karma.conf.js`,
          'progress': false,
          'codeCoverage': true,
          'browsers': 'ChromeHeadless',
          'codeCoverageExclude': ['dist/lib/core/**/*', 'src/lib/core/**/*']
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

export const allComponents = components;
