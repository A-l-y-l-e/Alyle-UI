import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import * as jsyaml from 'js-yaml';
const packageConf = `${process.cwd()}/.package.conf.yml`;
const config = jsyaml.load(readFileSync(packageConf, 'utf8').toString());
const libDir = `${process.cwd()}/src/lib`;

function updateVersion() {
  const newVersion = createVersion(config.version, config.lastUpdate);
  config.version = newVersion.version;
  config.lastUpdate = newVersion.lastUpdate;
  const versionContent = `export const AUI_VERSION = '${newVersion.version}';\nexport const AUI_LAST_UPDATE = '${newVersion.lastUpdate}';
`;
  const fileName = `${libDir}/core/src/version.ts`;
  const file = readFileSync(fileName, 'utf8').toString()
  .replace(/{\sversion\s}/g, config.version);
  writeFileSync(fileName, versionContent, 'utf8');
  writeFileSync(packageConf, jsyaml.dump(config), 'utf8');
}

function createVersion(currentVersion: string, lastUpdate: string) {
  const now = Date.now();
  const time = Math.floor((now - new Date(config.lastUpdate).getTime()) / 1000);
  const versionArray = currentVersion.split('.');
  let version;
  if (versionArray.length > 3) {
    const v = parseInt(versionArray[versionArray.length - 1], 36);
    versionArray[versionArray.length - 1] = `${(time + v).toString(36)}`;
  } else {
    versionArray[2] += 1;
  }
  version = versionArray.join('.');
  lastUpdate = new Date(now).toJSON();
  return {
    version,
    lastUpdate
  };
}

updateVersion();
