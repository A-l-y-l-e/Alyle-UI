import { readFileSync } from 'fs';

const pkgFile = readFileSync('package.json');
if (!pkgFile) {
  throw new Error(`This folder does not contain a package.json file.`);

}
const pkg = JSON.parse(pkgFile.toString('utf8'));

if (!(pkg.dependencies.typescript || pkg.devDependencies.typescript)) {
  throw new Error(`This project requires having typescript installed`);
}
