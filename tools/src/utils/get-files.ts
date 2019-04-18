import { promises } from 'fs';
import { resolve } from 'path';
const { readdir, stat } = promises;

export async function* getFiles(dir: string): AsyncIterableIterator<string> {
  const subdirs = await readdir(dir);
  for (const subdir of subdirs) {
    const res = resolve(dir, subdir);
    if ((await stat(res)).isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
