import { createHash } from 'crypto';
import { readFileSync, createReadStream, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const DIST = join(process.cwd(), 'dist/alyle-ui');

/** Read ngsw.json */
const ngswConfig: Manifest = JSON.parse(readFileSync(join(DIST, 'ngsw.json')).toString());

function fileHash(filename: string, algorithm = 'sha1'): Promise<string> {
  return new Promise((resolve, reject) => {
    const shasum = createHash(algorithm);
    try {
      const fileStream = createReadStream(filename);
      fileStream.on('data', (data) => {
        shasum.update(data);
      });
      // making digest
      fileStream.on('end', () => {
        const hash = shasum.digest('hex');
        return resolve(hash);
      });
    } catch (error) {
      return reject('calc fail');
    }
  });
}
async function hashAll() {
  const hashTable = ngswConfig.hashTable;
  const files = getAllHtml();
  const app = ngswConfig.assetGroups!.find(_ => _.name === 'app');

  for (const key in hashTable) {
    if (hashTable.hasOwnProperty(key)) {
      const distFileHash = await fileHash(join(DIST, key));
      if (distFileHash !== hashTable[key]) {
        console.log(`${chalk.green('hash updated for:')} ${chalk.greenBright(key)}`);
      }
      hashTable[key] = distFileHash;
    }
  }
  for (let index = 0; index < files.length; index++) {
    app!.urls.push(join(files[index].path));
    hashTable[files[index].path] = await fileHash(files[index].file);
    console.log(`${chalk.green('hash updated for:')} ${chalk.greenBright(files[index].path)}`);
  }

  /** Update file */
  writeFileSync(join(DIST, 'ngsw.json'), JSON.stringify(ngswConfig), 'utf8');

}
hashAll();

function getAllHtml() {
  const files: {
    path: string,
    file: string
  }[] = [];
  const getIndexs = (path: string) => {
    const items = readdirSync(path, 'utf8')
    .filter(_ => statSync(join(path, _)).isDirectory());
    items.forEach(name => {
      const __path = join(path, name, 'index.html');
      if (existsSync(__path)) {
        files.push({
          path: join(path, name).replace(DIST, ''),
          file: __path
        });
      }
      getIndexs(join(path, name));
    });
  };
  getIndexs(DIST);
  return files;
}

export interface Manifest {
  configVersion: number;
  timestamp: number;
  appData?: {[key: string]: string};
  index: string;
  assetGroups?: AssetGroupConfig[];
  dataGroups?: DataGroupConfig[];
  navigationUrls: {positive: boolean, regex: string}[];
  hashTable: {[url: string]: string};
}

export interface AssetGroupConfig {
  name: string;
  installMode: 'prefetch'|'lazy';
  updateMode: 'prefetch'|'lazy';
  urls: string[];
  patterns: string[];
}

export interface DataGroupConfig {
  name: string;
  version: number;
  strategy: 'freshness'|'performance';
  patterns: string[];
  maxSize: number;
  timeoutMs?: number;
  refreshAheadMs?: number;
  maxAge: number;
}
