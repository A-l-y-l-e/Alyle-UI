import { promises } from 'fs';
import { join, basename } from 'path';
import chalk from 'chalk';
const { readFile, writeFile, mkdir } = promises;
import { highlight } from './html-loader/loader';
import { resolveSpawn } from './utils/resolve-spawn';
import { getFiles } from './utils/get-files';


(async () => {
  const DOCS_CONTENT_DEMOS = 'docs-content/demos';
  const distDocsContent = join(process.cwd(), 'dist', DOCS_CONTENT_DEMOS);
  await resolveSpawn(`rm -rf ${DOCS_CONTENT_DEMOS}`);
  await mkdir(distDocsContent);

  for await (const file of getFiles(join(process.cwd(), 'src/app'))) {
    if (
      (
        (file.endsWith('.ts') && !file.endsWith('.spec.ts'))
        || file.endsWith('.html'))
    ) {
      const lang = file.endsWith('ts') ? 'ts' : 'html';
      const buffer = await readFile(file, 'utf8').catch((err) => {
        console.log(err);
        return null;
      });
      if (buffer) {
        const highlightHtml = highlight(buffer.toString(), lang);
        const filePath = join(distDocsContent, `${basename(file)}.html`);
        await writeFile(filePath, highlightHtml);
        console.log(`${chalk.greenBright(`Added: `)}${join('dist', DOCS_CONTENT_DEMOS, basename(file))}.html`);
      }
    }
  }
})();
