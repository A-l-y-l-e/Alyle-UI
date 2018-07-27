import { allComponents } from './prepare-lib';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { copySync } from 'fs-extra';
import { writeFileSync, readFileSync} from 'fs';

/** build all */
// let previousBuild = Promise.resolve();
const ls = spawnSync('yarn', ['ng-packagr', '-p', 'dist/lib/ng-package.json'], {stdio: 'inherit'});
if (ls.status) {
  process.exit(1);
}
// allComponents.forEach((lib) => {
//   previousBuild = previousBuild.then(_ => {
//     console.log(lib.pkgName);
//     if (ls.status) {
//       process.exit(1);
//     }
//     const dirLib = join(`${process.cwd()}/dist`, lib.pkgName);
//     copySync(dirLib, `${process.cwd()}/dist/node_modules/${lib.pkgName}`);
//     /** for subModules */
//     // const pkg = JSON.parse(readFileSync(join(dirLib, 'package.json')).toString());
//     // const tempPkg = {
//     //   'name': pkg.name,
//     //   'sideEffects': false
//     // };
//     // [
//     //   'main',
//     //   'module',
//     //   'es2015',
//     //   'esm5',
//     //   'esm2015',
//     //   'fesm5',
//     //   'fesm2015',
//     //   'typings',
//     //   'metadata'
//     // ].forEach(key => {
//     //   tempPkg[key] = `./${pkg[key]}`;
//     // });
//     // let newPkg;
//     // if (lib.pkgName.split('/').length > 2) {
//     //   newPkg = tempPkg;
//     // } else {
//     //   newPkg = Object.assign(pkg, tempPkg);
//     // }
//     // writeFileSync(join(`${process.cwd()}/dist`, lib.pkgName, 'package.json'), JSON.stringify(newPkg, undefined, 2), 'utf8');
//   });
// });
