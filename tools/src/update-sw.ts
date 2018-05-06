import { createHash } from 'crypto';
import { readFileSync, createReadStream, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const DIST = join(process.cwd(), 'dist/alyle-ui');

/** Read ngsw.json */
const ngswConfig = JSON.parse(readFileSync(join(DIST, 'ngsw.json')).toString());

function sha1( data: string ) {
  const generator = createHash('sha1');
  generator.update( data );
  return generator.digest('hex');
}
function fileHash(filename: string, algorithm = 'sha1') {
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
  const assets = ngswConfig.assetGroups.find(_ => _.name === 'assets');
  for (let index = 0; index < files.length; index++) {
    assets.urls.push(files[index].path);
    hashTable[files[index].fullPath] = null;
    console.log(files[index]);
  }
  // console.log(files.length);
  // console.log('files', JSON.stringify(files, undefined, 2));
  for (const key in hashTable) {
    if (hashTable.hasOwnProperty(key)) {
      const distFileHash = await fileHash(join(DIST, key));
      if (distFileHash !== hashTable[key]) {
        console.log(`${chalk.green('hash updated for:')} ${chalk.greenBright(key)}`);
      }
      hashTable[key] = distFileHash;
    }
  }
  // for (let index = 0; index < files.length; index++) {
  //   const name = files[index];
  //   hashTable[name] = await fileHash(join(DIST, name));
  // }
  // ngswConfig.hashTable = hashTable;

  /** Update file */
  writeFileSync(join(DIST, 'ngsw.json'), JSON.stringify(ngswConfig, undefined, 2), 'utf8');

}
hashAll();

function getAllHtml() {
  const files: {
    fullPath: string,
    path: string
  }[] = [];
  const getIndexs = (path: string) => {
    const items = readdirSync(path, 'utf8')
    .filter(_ => statSync(join(path, _)).isDirectory());
    items.forEach(name => {
      const __path = join(path, name, 'index.html');
      if (existsSync(__path)) {
        files.push({
          path: join(path, name).replace(DIST, ''),
          fullPath: __path.replace(DIST, '')
        });
      }
      getIndexs(join(path, name));
    });
  };
  getIndexs(DIST);
  return files;
}
