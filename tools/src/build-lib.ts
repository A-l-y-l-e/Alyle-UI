import { allComponents } from './prepare-lib';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { copySync } from 'fs-extra';

/** build all */
let previousBuild = Promise.resolve();
allComponents.forEach((lib) => {
  previousBuild = previousBuild.then(_ => {
    console.log(lib.pkgName);
    const ls = spawnSync('ng', ['build', lib.pkgName, '--prod'], {stdio: 'inherit'});
    if (ls.status) {
      process.exit(1);
    }
    copySync(join(`${process.cwd()}/dist`, lib.pkgName), `${process.cwd()}/dist/node_modules/${lib.pkgName}`);
  });
});
