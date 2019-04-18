import { promises } from 'fs';
import { join, basename } from 'path';
import chalk from 'chalk';
const { readFile, writeFile, mkdir } = promises;
import { highlight } from './html-loader/loader';
import { resolveSpawn } from './utils/resolve-spawn';
import { getFiles } from './utils/get-files';


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
        console.log(`${chalk.greenBright(`Added: `)}${join('dist', 'docs-content', basename(file))}.html`);
        await writeFile(join(distDocsContent, `${basename(file)}.html`), highlightHtml);
      }
    }
  }
})();
