#!/usr/bin/env node
import { promises as fs } from 'fs';
import * as path from 'path';
import './check';
import * as yargs from 'yargs';
import * as c from 'ansi-colors';
import { styleCompiler, hasLylStyle } from './compiler';
export const AUI_VERSION = '17.0.0';

const note = `Note: It is recommended to use git and have saved the changes.\n`
  + `Compile the files for production only, this will modify your\nlyl styles to another format.\n`;

const argv = yargs
  .alias('h', 'help')
  .alias('v', 'version')
  .version()
  .help(false).argv;
if (argv.help) {
  console.log(`Version ${AUI_VERSION}\n`);
  console.log(c.bold.yellowBright(note));
  console.log(`Usage: lyl src`);
  process.exit(0);
}


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

const directory = argv._[0];

if (directory) {
  console.log(c.bold.blueBright(`Directory: ${directory}`));
} else {
  console.log(c.bold.redBright(`Require directory`));
  console.log(`Examples: lyl dist/lib`);
  process.exit(1);
}

walk(directory).then(async (res) => {
  res = res
    .filter(file => file.endsWith('.ts'));

  res.forEach(async file => {
    const content = (await fs.readFile(file)).toString('utf8');
    const hasLyl = hasLylStyle(content);
    if (hasLyl) {
      let compiled: string | null = null;
      try {
        compiled = styleCompiler(content);
        console.log(`${c.bold.greenBright('Updated: ')}${file}`);
      } catch (error) {
        console.log(c.yellow(`error in ${file}`), error);
      }
      if (compiled) {
        await fs.writeFile(file, compiled, 'utf8');
      }
    }
  });

});
