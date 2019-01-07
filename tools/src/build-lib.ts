import { allComponents } from './prepare-lib';
import { spawn } from 'child_process';
const replace = require('replace-in-file');


// fix typings
const changes = replace.sync({
  files: 'dist/@alyle/ui/**/*.d.ts',
  from: /\.\.\/\.\.\/\@alyle\/ui/g,
  to: '@alyle/ui'
});

// fix path
const changesSchematics = replace.sync({
  files: 'dist/@alyle/ui/schematics/**/*.js',
  from: /require(\"\@schematics\/angular\/node_modules\/typescript\")/g,
  to: 'require("typescript")'
});

console.log('fix typings', { changes });
console.log('fix typings', { changesSchematics });

