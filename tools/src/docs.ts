/**
 * Generate templates
 */

import * as fs from 'fs';
import { join } from 'path';

import { ProjectReflection } from 'typedoc';

interface DocsPackage {
  children: {
    name: string
    type: string
  }[];
}
interface DocsPackageLarge {
  directiveList: {
    name: string
    selector: string
    exportAs: string
    inputs: string
  }[];
  componentList: {
    name: string
    selector: string
    inputs: string
    exportAs: string
  }[];
  [type: string]: {
    name: string
  }[];
}

const docsJSON: ProjectReflection = JSON.parse(fs.readFileSync(join(process.cwd(), 'dist/docs.json')).toString());

const APIList: {[name: string]: DocsPackage} = {};
const APIListLarge: {[name: string]: DocsPackageLarge} = {};

docsJSON.children.forEach(child => {
  if (child.children) {
    const pkgName = getPackageName(child.name);

    /**
     * if not exist add defaults
     */
    if (!APIList[pkgName]) {
      APIList[pkgName] = {
        children: []
      };
    }

    if (!APIListLarge[pkgName]) {
      APIListLarge[pkgName] = {
        classeList: [],
        constList: [],
        directiveList: [],
        enumList: [],
        functionList: [],
        interfaceList: [],
        ngModuleList: [],
        TypeAliasList: [],
        componentList: []
      };
    }

    child.children.forEach(_child => {
      // igonre styles
      if (_child.name.toLowerCase() === 'styles') {
        return;
      }
      const { name, decorators, kindString } = _child;
      const type = decorators ? decorators[0].name : kindString;
      APIList[pkgName].children.push({
        name,
        type
      });
      if (type === 'Component') {
        console.log(decorators[0].arguments.obj);
        const selector = ((/selector:\s?\'?\`?([\w\-\,\[\]\s]+)\'/g).exec(decorators[0].arguments.obj))[1];
        const exportAs = ((/exportAs:\s?\'?\`?([\w\-\,\[\]\s]+)\'/g).exec(decorators[0].arguments.obj) || [])[1] || null;
        APIListLarge[pkgName].componentList.push({
          name,
          selector,
          inputs: null,
          exportAs
        });
      }
    });
    console.log(pkgName);
  }
});

// console.log(JSON.stringify(APIList, undefined, 2));
console.log(JSON.stringify(APIListLarge, undefined, 2));

fs.writeFileSync(join(process.cwd(), 'docs/APIList.json'), JSON.stringify(APIList, undefined, 2), 'utf8');
fs.writeFileSync(join(process.cwd(), 'docs/APIList.min.json'), JSON.stringify(APIList), 'utf8');

function getPackageName(name: string) {
  // ignore src
  if (name.indexOf('\"src') === 0) {
    return 'root';
  }
  return name.split('/').slice(0, -1).join('/').replace(`\"`, '');
}

