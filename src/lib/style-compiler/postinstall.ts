import { promises, existsSync } from 'fs';
import { join } from 'path';
import { argv } from 'yargs';

const { readFile, writeFile } = promises;
const PROGRAM_FILE = 'node_modules/@angular/compiler-cli/src/transformers/program.js';
const REGEX_POS = /_emitRender2([^]+)var\ssourceFile\s=\ssourceFiles/;


const errorOnIncompatible = () => {
  throw Error(`Error when trying to update the rules, it is likely that this version of Angular CLI is not compatible with Alyle UI.`);
};

(async () => {
  const buffer = await readFile(join(process.cwd(), PROGRAM_FILE)).catch(errorOnIncompatible);
  let data = buffer.toString('utf8');
  const fileNameBak = join(process.cwd(), PROGRAM_FILE + '.bak');

  if (existsSync(fileNameBak)) {
    data = (await readFile(fileNameBak)).toString('utf8');
  } else {
    // clone source
    await writeFile(fileNameBak, data);
  }

  if (REGEX_POS.test(data)) {

    const loaderPath = argv.internalUse
      ? join(process.cwd(), 'dist/@alyle/ui/style-compiler/index')
      : '@alyle/ui/style-compiler';

    const result = data.replace(REGEX_POS, (_ex, block) => {
      return _ex.replace(block, `${block}


      /**
       * @lyl
       * Improve styles of Alyle UI
       */
      if (outFileName.endsWith('.js')) {
        outData = require('${loaderPath}').StyleCompiler(outData);
      }


      `);
    });
    await writeFile(join(process.cwd(), PROGRAM_FILE), result);
  } else {
    errorOnIncompatible();
  }

})();
