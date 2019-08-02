import { promises, existsSync } from 'fs';
import { join } from 'path';
import { argv } from 'yargs';

const { readFile, writeFile } = promises;
const WEBPACK_CONFIG_COMMON = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/common.js';
const REGEX_POS = /rules\:\s?\[/;


const errorOnIncompatible = () => {
  throw Error(`Error when trying to update the rules, it is likely that this version of Angular CLI is not compatible with Alyle UI.`);
};

(async () => {
  const buffer = await readFile(join(process.cwd(), WEBPACK_CONFIG_COMMON)).catch(errorOnIncompatible);
  let data = buffer.toString('utf8');
  const fileNameBak = join(process.cwd(), WEBPACK_CONFIG_COMMON + '.bak');

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

    const result = data.replace(REGEX_POS, str => {
      return `${str}
      /**
       * @ly
       * Rules for improve styles of Alyle UI
       */
      {
        test: /\\.ts$/,
        loader: '${loaderPath}',
        enforce: 'pre'
      },`;
    });
    await writeFile(join(process.cwd(), WEBPACK_CONFIG_COMMON), result);
  } else {
    errorOnIncompatible();
  }

})();
