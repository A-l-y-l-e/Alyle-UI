import * as _replace from 'replace-in-file';
const replace: typeof _replace.default = require('replace-in-file');

// fix typings
const changes = replace.sync({
  files: 'dist/@alyle/ui/**/*.d.ts',
  from: /(:?\.\.\/)+@alyle\/ui/g,
  to: '@alyle/ui'
}).filter(({ hasChanged }) => hasChanged);

// fix path
const changesSchematics = replace.sync({
  files: 'dist/@alyle/ui/schematics/**/*.js',
  from: /require\(\"\@schematics\/angular\/node_modules\/typescript\"\)/g,
  to: 'require("typescript")'
}).filter(({ hasChanged }) => hasChanged);

console.log('fix typings', { changes });
console.log('fix path', { changesSchematics });

