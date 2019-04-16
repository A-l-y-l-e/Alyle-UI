import { exists, promises } from 'fs';


import { resolve, join, basename } from 'path';
import { highlight } from './html-loader/loader';
import { resolveSpawn } from './utils/resolve-spawn';
const { readdir, stat, readFile, writeFile, mkdir, rmdir } = promises;

async function* getFiles(dir: string): AsyncIterableIterator<string> {
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

(async () => {
  const distDocsContent = join(process.cwd(), 'dist', 'docs-content');
  await resolveSpawn('rm -rf dist/docs-content');
  await mkdir(distDocsContent);

  for await (const file of getFiles(join(process.cwd(), 'src/app'))) {
    if (
      (
        (file.endsWith('.ts') && !file.endsWith('.spec.ts'))
        || file.endsWith('.html')
      )
      && file.includes('demo')
    ) {
      const lang = file.endsWith('ts') ? 'ts' : 'html';
      const buffer = await readFile(file, 'utf8').catch((err) => {
        console.log(err);
        return null;
      });
      if (buffer) {
        const highlightHtml = highlight(buffer.toString(), lang);
        console.log(join(distDocsContent, `${basename(file)}.html`));
        // await writeFile(join(distDocsContent, basename(file)), highlightHtml);
      }
    }
  }
})();
