/**
 * Generate templates
 */

import * as fs from 'fs';
import { join } from 'path';

import { ProjectReflection } from 'typedoc';

interface DocsPackage {
  name: string;
  children: {
    name: string
    type: string
  }[];
}

const docsJSON: ProjectReflection = JSON.parse(fs.readFileSync(join(process.cwd(), 'dist/docs.json')).toString());

const APIList: {[name: string]: DocsPackage} = {};

docsJSON.children.forEach(child => {
  if (child.children) {
    const name = getPackageName(child.name);

    /**
     * if not exist add defaults
     */
    if (!APIList[name]) {
      APIList[name] = {
        name,
        children: []
      };
    }
    child.children.forEach(_child => {
      APIList[name].children.push({
        name: _child.name,
        type: _child.kindString
      });
    });
    console.log(name);
  }
});

console.log(JSON.stringify(APIList, undefined, 2));

function getPackageName(name: string) {
  // ignore src
  if (name.indexOf('\"src') === 0) {
    return 'root';
  }
  return name.split('/').slice(0, -1).join('/').replace(`\"`, '');
}

