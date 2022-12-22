import * as path from 'path';
import __replace from 'replace-in-file';
import * as fs from 'fs';
import * as globby from 'globby';
const { readFile, writeFile, readdir } = fs.promises;
const { replaceInFile } = __replace;
const pkg = JSON.parse(await readFile(path.join(process.cwd(), './package.json'), 'utf-8'));
const AUI_VERSION = pkg.version;
const HAMMERJS_VERSION = pkg.dependencies.hammerjs;
const ANGULAR_CDK_VERSION = pkg.dependencies['@angular/cdk'];
const ANGULAR_CLI_VERSION = pkg.devDependencies['@angular/cli'];
const ANGULAR_DEVKIT_BUILD_ANGULAR_VERSION = pkg.devDependencies['@angular-devkit/build-angular'];
const ANGULAR_COMPILER_CLI_VERSION = pkg.devDependencies['@angular/compiler-cli'];
const TYPES_NODE_VERSION = pkg.devDependencies['@types/node'];
const TYPESCRIPT_VERSION = pkg.devDependencies['typescript'];

(async () => {

  await updateStackblitzPackage();
  await generateStackblitzAssets();

  const replaceResult = await replaceInFile({
    files: [
      'src/lib/schematics/**/*.ts',
      'src/lib/style-compiler/main.ts'
    ],
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
      console.log(`UPDATED: ${file}`);
    });

})();

async function updateStackblitzPackage() {
  const filePath = path.join(process.cwd(), 'src/stackblitz/package.json');
  const pkgFile = await readFile(filePath, 'utf-8');
  const pkgOb = JSON.parse(pkgFile);
  pkgOb.dependencies['@alyle/ui'] = AUI_VERSION;
  pkgOb.dependencies['@angular/cdk'] = ANGULAR_CDK_VERSION;
  pkgOb.devDependencies['@angular/cli'] = ANGULAR_CLI_VERSION;
  pkgOb.devDependencies['@angular-devkit/build-angular'] = ANGULAR_DEVKIT_BUILD_ANGULAR_VERSION;
  pkgOb.devDependencies['@angular/compiler-cli'] = ANGULAR_COMPILER_CLI_VERSION;
  pkgOb.devDependencies['@types/node'] = TYPES_NODE_VERSION;
  pkgOb.devDependencies['typescript'] = TYPESCRIPT_VERSION;
  await writeFile(filePath, JSON.stringify(pkgOb, null, 2));
}

async function generateStackblitzAssets() {
  const dir = path.join(process.cwd(), 'src/stackblitz');
  const files: {[path: string]: string} = {};
  const isIgnored = await globby.gitignore({cwd: path.join(process.cwd(), 'src/stackblitz')});
  for await (const f of getFiles(dir)) {
    if (isIgnored(f)) {
      // Ggnore files using .gitignore
      continue;
    }
    const newPath = (f).replace(`${process.cwd()}/src/stackblitz/`, '');
    files[newPath] = await readFile(f, 'utf-8');
  }
  const outputPath = path.join(process.cwd(), 'src/assets/stackblitz-files.json');
  const oldData = await readFile(outputPath, 'utf-8');
  const newData = JSON.stringify(files, null, 2);
  if (oldData !== newData) {
    await writeFile(outputPath, newData);
    console.log(`UPDATED: ${outputPath}`);
  }
}

async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirents = (await readdir(dir, { withFileTypes: true })).filter(_ => !(_.isDirectory() && _.name === 'node_modules'));
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
