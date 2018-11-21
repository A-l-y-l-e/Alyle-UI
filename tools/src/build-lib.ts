import { allComponents } from './prepare-lib';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { copySync } from 'fs-extra';
import { writeFileSync, readFileSync} from 'fs';
const replace = require('replace-in-file');

/** build all */
const ls = spawnSync('yarn', ['ng-packagr', '-p', 'dist/lib/ng-package.json'], {stdio: 'inherit'});

// fix typings
const changes = replace.sync({
  files: 'dist/@alyle/ui/**/*.d.ts',
  from: /\.\.\/\.\.\/\@alyle\/ui/g,
  to: '@alyle/ui'
});

console.log('fix typings', {changes});

if (ls.status) {
  process.exit(1);
}
