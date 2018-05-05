import { createHash } from 'crypto';
import { readFileSync, createReadStream, writeFileSync } from 'fs';
import { join } from 'path';

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
  for (const key in hashTable) {
    if (hashTable.hasOwnProperty(key)) {
      //  console.log(key, hashTable[key]);
      const distFileHash = await fileHash(join(DIST, key));
      if (distFileHash !== hashTable[key]) {
        console.log(`hash updated: ${key}`);
      }
      hashTable[key] = distFileHash;
    }
  }
  ngswConfig.hashTable = hashTable;

  /** Update file */
  writeFileSync(join(DIST, 'ngsw.json'), JSON.stringify(ngswConfig, undefined, 2), 'utf8');

}
hashAll();
console.log('end', sha1('adrian') );
