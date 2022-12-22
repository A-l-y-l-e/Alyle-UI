import _replace from 'replace-in-file';
const { replaceInFileSync } = _replace;

// fix typings
const changes = replaceInFileSync({
  files: 'dist/@alyle/ui/**/*.d.ts',
  from: /(:?\.\.\/)+@alyle\/ui/g,
  to: '@alyle/ui'
}).filter(({ hasChanged }) => hasChanged);

// fix path
const changesSchematics = replaceInFileSync({
  files: 'dist/@alyle/ui/schematics/**/*.js',
  from: /require\(\"\@schematics\/angular\/node_modules\/typescript\"\)/g,
  to: 'require("typescript")'
}).filter(({ hasChanged }) => hasChanged);

console.log('fix typings', { changes });
console.log('fix path', { changesSchematics });

