import { readFileSync, writeFileSync } from 'fs';
import * as jsyaml from 'js-yaml';
import * as moment from 'moment';

const packageConf = `${process.cwd()}/.package.conf.yml`;
const config = jsyaml.load(readFileSync(packageConf, 'utf8').toString());
const libDir = `${process.cwd()}/src/lib`;
const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString());
const pkgLib = JSON.parse(readFileSync(`${process.cwd()}/src/lib/package.json`, 'utf8').toString());

const isNightly = process.argv.some(_ => _ === '--nightly');

function updateVersion() {
  const newVersion = createVersion(config.version);
  config.version = newVersion.version;
  pkg.version = newVersion.version;
  config.lastUpdate = newVersion.lastUpdate;
  const versionContent = `export const AUI_VERSION = '${newVersion.version}';\nexport const AUI_LAST_UPDATE = '${newVersion.lastUpdate}';
`;
  pkgLib.version = newVersion.version;
  const fileName = `${libDir}/src/version.ts`;
  writeFileSync(fileName, versionContent, 'utf8');
  writeFileSync(packageConf, jsyaml.dump(config), 'utf8');
  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, undefined, 2), 'utf8');
  writeFileSync(`${process.cwd()}/src/lib/package.json`, JSON.stringify(pkgLib, undefined, 2), 'utf8');
}

function createVersion(currentVersion: string) {
  const newDate = new Date();
  const now = newDate.getTime();
  const date = `${moment().format('YYYYMMDD')}-${Date.now().toString(36)}`;
  let versionArray = currentVersion.split('.');
  const nightlyVersion = `-nightly.${date}`;
  let version;

  if (process.env.NEW_VERSION) {

    // Bump custom new version

    // Clean
    versionArray = [...process.env.NEW_VERSION.split('.')];
  } else if (isNightly) {
    if (versionArray.length > 3) {
      versionArray[versionArray.length - 1] = date;
    } else {
      versionArray[2] = `${parseFloat(versionArray[2]) + 1}` + nightlyVersion;
    }
  } else {
    if (versionArray.length > 3) {
      versionArray.splice(3);
      versionArray[2] = versionArray[2].replace('-nightly', '');
    } else {
      versionArray[2] = `${parseFloat(versionArray[2]) + 1}`;
    }
  }
  version = versionArray.join('.');
  const lastUpdate = new Date(now).toJSON();
  return {
    version,
    lastUpdate
  };
}

updateVersion();
