#!/usr/bin/env node
import { promises as fs, readFileSync } from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import chalk from 'chalk';
import { styleCompiler, hasLylStyle } from './compiler';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

const note = `Note: It is recommended to use git and have saved the changes.\n`
  + `Compile the files for production only, this will modify your\nlyl styles to another format.\n`;

const argv = yargs
  .alias('h', 'help')
  .alias('v', 'version')
  .version()
  .help(false).argv;
if (argv.help) {
  console.log(`Version ${pkg.version}\n`);
  console.log(chalk.bold.yellowBright(note));
  console.log(`Examples: lyl directory`);
  process.exit(0);
}
console.log({argv});

async function walk(dir: string, fileList: string[] = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = await walk(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

walk('src/lib').then(async (res) => {
  res = res
    .filter(file => file.endsWith('.ts'));

  res.forEach(async file => {
    const content = (await fs.readFile(file)).toString('utf8');
    const hasLyl = hasLylStyle(content);
    if (hasLyl) {
      console.log(file);
    }
  });

});
