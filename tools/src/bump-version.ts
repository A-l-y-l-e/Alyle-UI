import { readFileSync, writeFileSync } from 'fs';
import * as jsyaml from 'js-yaml';
import * as moment from 'moment';
import * as semver from 'semver';

const packageConf = `${process.cwd()}/.package.conf.yml`;
const config = jsyaml.load(readFileSync(packageConf, 'utf8').toString());
const libDir = `${process.cwd()}/src/lib`;
const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString());
const pkgLib = JSON.parse(readFileSync(`${process.cwd()}/src/lib/package.json`, 'utf8').toString());
const styleCompilerLib = JSON.parse(readFileSync(`${process.cwd()}/src/lib/style-compiler/package.json`, 'utf8').toString());

const {
  NEW_RELEASE
} = process.env;

if (!NEW_RELEASE) {
  console.log('Bump Version: skiped.');
  process.exit(0);
}

function updateVersion() {
  const newVersion = createVersion(config.version);
  config.version = newVersion.version;
  pkg.version = newVersion.version;
  config.lastUpdate = newVersion.lastUpdate;
  const versionContent = `export const AUI_VERSION = '${newVersion.version}';\nexport const AUI_LAST_UPDATE = '${newVersion.lastUpdate}';
`;
  pkgLib.version = newVersion.version;
  styleCompilerLib.version = newVersion.version;
  const fileName = `${libDir}/src/version.ts`;
  writeFileSync(fileName, versionContent, 'utf8');
  writeFileSync(packageConf, jsyaml.dump(config), 'utf8');
  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, undefined, 2), 'utf8');
  writeFileSync(`${process.cwd()}/src/lib/package.json`, JSON.stringify(pkgLib, undefined, 2), 'utf8');
  writeFileSync(`${process.cwd()}/src/lib/style-compiler/package.json`, JSON.stringify(pkgLib, undefined, 2), 'utf8');
}

function createVersion(currentVersion: string) {
  const newDate = new Date();
  const now = newDate.getTime();
  const lastUpdate = new Date(now).toJSON();
  const date = `${moment(now).format('YYMMDD')}${moment().format('HHmm')}`;
  let version = '';

  if (/patch/i.test(NEW_RELEASE!)) {
    version = semver.inc(currentVersion, 'patch')!;
  } else if (/nightly/i.test(NEW_RELEASE!)) {
    version = semver.inc(currentVersion, 'prerelease', 'nightly')!.replace('ly.0', `ly.${date}`);
  } else if (/minor/i.test(NEW_RELEASE!)) {
    version = semver.inc(currentVersion, 'minor')!;
  } else if (/major/i.test(NEW_RELEASE!)) {
    version = semver.inc(currentVersion, 'major')!;
  }

  return {
    version,
    lastUpdate
  };
}

updateVersion();
