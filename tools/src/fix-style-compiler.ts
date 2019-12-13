import { promises as fs } from 'fs';

(() => {
  const modules = [
    'typescript',
    'yargs'
  ];
  const files = [
    'main',
    'compiler',
    'util/util'
  ];

  files.map(nam => `dist/@alyle/ui/style-compiler/${nam}.js`).forEach(async (path) => {
    let file = await fs.readFile(path, 'utf8');
    for (let index = 0; index < modules.length; index++) {
      const modl = modules[index];
      file = file.replace(
        new RegExp(`require\\("${modl}"\\)`),
        `require(process.cwd() + "/node_modules/${modl}")`
      );
    }
    fs.writeFile(path, file);
  });

})();
