import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import * as jsyaml from 'js-yaml';

const config = jsyaml.load(readFileSync(`${process.cwd()}/.package.conf.yml`, 'utf8').toString());
const libDir = `${process.cwd()}/src/lib`;
function updateVersion() {
  const fileName = `${libDir}/core/src/version.ts`;
  const file = readFileSync(fileName, 'utf8').toString()
  .replace(/{\sversion\s}/g, config.version);
  writeFileSync(fileName, file, 'utf8');
}
/** Update version in app.component.ts */
updateVersion();
