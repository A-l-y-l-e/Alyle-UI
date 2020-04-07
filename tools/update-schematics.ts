import * as path from 'path';
import * as _replace from 'replace-in-file';
const replace: typeof _replace.default = require('replace-in-file');

const pkg = require(path.join(process.cwd(), './package.json'));
const AUI_VERSION = pkg.version;
const HAMMERJS_VERSION = pkg.dependencies.hammerjs;
const ANGULAR_CDK_VERSION = pkg.dependencies['@angular/cdk'];


(async () => {

  const replaceResult = await replace({
    files: 'src/lib/schematics/**/*.ts',
    from: [
      /const AUI_VERSION = [^\n]+/g,
      /const HAMMER_JS = [^\n]+/g,
      /const ANGULAR_CDK_VERSION = [^\n]+/g
    ],
    to: [
      `const AUI_VERSION = '${AUI_VERSION}';`,
      `const HAMMERJS_VERSION = '${HAMMERJS_VERSION}';`,
      `const ANGULAR_CDK_VERSION = '${ANGULAR_CDK_VERSION}';`
    ]
  });

  replaceResult
    .filter(({ hasChanged }) => hasChanged)
    .map(({ file }) => {
      console.log(`UPDATE: ${file}`);
    });

})();
