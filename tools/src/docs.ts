/**
 * Generate templates
 */

import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

import { ProjectReflection, DeclarationReflection, ParameterReflection, Reflection } from 'typedoc';
import { ensureDirSync } from 'fs-extra';

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
    inputs: string
    exportAs: string
    children: string
  }[];
  componentList: {
    name: string
    selector: string
    inputs: string
    exportAs: string
    children: string
  }[];
  [type: string]: {
    name: string
    children: string
  }[];
}

const docsJSON: ProjectReflection = JSON.parse(readFileSync(join(process.cwd(), 'dist/docs.json')).toString());

const OUT_DIR = join(process.cwd(), `docs/@alyle/ui`);

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
        componentList: [],
        directiveList: []
      };
    }

    child.children.forEach(_child => {
      // igonre styles
      if (_child.name.toLowerCase() === 'styles') {
        return;
      }
      const { name, decorators, kindString, children } = _child;
      const type = decorators ? decorators[0].name : kindString;
      APIList[pkgName].children.push({
        name,
        type
      });
      const Type = `${toCamelcase(type)}List`;
      if (type === 'Component' || type === 'Directive') {
        const selector = ((/selector:\s?\`?\'?\`?([\w\-\,\[\]\s\>]+)\'?\'?/).exec(decorators[0].arguments.obj))[1];
        const exportAs = ((/exportAs:\s?\`?\'?\`?([\w\-\,\[\]\s\>]+)\'?\'?/).exec(decorators[0].arguments.obj) || [])[1] || null;
        const __data = {
          name,
          selector,
          inputs: null,
          exportAs,
          children: ''
        };
        (
          type === 'Component'
          ? APIListLarge[pkgName].componentList
          : APIListLarge[pkgName].directiveList
        ).push(__data);

        if (children) {
          const items = [];
          children.forEach(de => {
            if (!(
              de.name.startsWith('_') || checkIfContainTagPrivate(de) ||
              checkIfIsMethodLifecycle(de)
            )) { // ignore for names start with '_'
              let comment = '';
              if (de.comment) {
                comment += createDescription(de.comment);
                items.push(comment);
              }
              if (de.kindString === 'Property') {
                let line = '';
                if (de.decorators) {
                  de.decorators.forEach(_ => {
                      line += `@${_.name}() `;
                  });
                }
                line += `${de.name}: `;
                line += de.type && de.type['name'] ? de.type['name'] : 'any';
                items.push(line);
              } else if (de.kindString === 'Accessor') {

                let line = '';
                if (de.decorators) {
                  de.decorators.forEach(_ => {
                    line += `@${_.name}(`;
                    if (_.arguments.bindingPropertyName) {
                      line += _.arguments.bindingPropertyName;
                    }
                    line += `) `;
                  });
                }
                line += `${de.name}: `;
                line += `${de.getSignature && (de.getSignature.type.type === 'intrinsic' || de.getSignature.type.type === 'reference')
                ? (de.getSignature.type['name'])
                : 'any'}`;
                items.push(line);
              } else if (de.kindString === 'Method') {
                let line = '';
                line += methodTemplate(de);
                items.push(line);
              }
            }
          });
          __data.children = items.join(`\n`);
        }

      } else if ((_child.flags.isExported || (kindString === 'Variable' && _child.flags.isConst)) && !checkIfContainTagPrivate(_child)) {
        if (!APIListLarge[pkgName][Type]) {
          APIListLarge[pkgName][Type] = [];
        }
        if (kindString === 'Variable' && _child.flags.isConst) {

          let items = `const ${name}`;

          if (_child.type) {
            if (_child.type.type !== 'unknown' && !_child.defaultValue) {
              items += `: ${getType(_child.type, 'any')}`;
            }
             if (_child.defaultValue) {
              items += ` = ${_child.defaultValue.trim()}`;
            }
          }
          APIListLarge[pkgName][Type].push({
            name,
            children: items
          });
        } else if (type === 'NgModule') {
          APIListLarge[pkgName][Type].push({
            name,
            children: `import { ${name} } from '${join('@alyle/ui', pkgName === 'root' ? '' : pkgName)}'`
          });
        } else if (type === 'Enumeration') {
          let line = `enum ${name} `;
          line += `{\n`;
          line += _child.children.map(_ => {
            let k = `  `;
            if (_.comment) {
              k += `${createDescription(_.comment)}\n  `;
            }
            k += `${_.name}`;
            if (_.defaultValue) {
              k += ` = ${_.defaultValue}`;
            }
            return k;
          }).join(`,\n`);
          line += `\n}`;
          APIListLarge[pkgName][Type].push({
            name,
            children: line
          });
        } else if (type === 'Interface' && _child.children) {
          let line = `interface ${name} `;
          line += `{\n`;

          line += _child.children.map(_ => {
            let k = `  `;
            if (_.comment) {
              k += `${createDescription(_.comment)}\n  `;
            }
            k += `${_.name}`;
            if (_.type) {
              k += `: ${getType(_.type, 'any')}`;
            }
            return k;
          }).join(`,\n`);
          line += `\n}`;
          APIListLarge[pkgName][Type].push({
            name,
            children: line
          });
        } else if (kindString === 'Type alias') {
          let line = '';
          if (_child.comment) {
            line += `${createDescription(_child.comment)}\n`;
          }
          line += `type ${name}`;

          if (_child.type) {
            if (_child.type.type !== 'unknown') {
              line += ` = ${getType(_child.type, 'any')}`;
            }
          }
          APIListLarge[pkgName][Type].push({
            name,
            children: line
          });
        }
      }
    });
  }
});

// console.log(JSON.stringify(APIList, undefined, 2));
// console.log(JSON.stringify(APIListLarge, undefined, 2));

ensureDirSync(OUT_DIR);

writeFileSync(join(OUT_DIR, 'APIList.json'), JSON.stringify(APIList, undefined, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'APIList.min.json'), JSON.stringify(APIList), 'utf8');
writeFileSync(join(OUT_DIR, 'APIListLarge.json'), JSON.stringify(APIListLarge, undefined, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'APIListLarge.min.json'), JSON.stringify(APIListLarge), 'utf8');

for (const key in APIListLarge) {
  if (APIListLarge.hasOwnProperty(key)) {
    const item = APIListLarge[key];

    const fullPath = join(OUT_DIR, key.split('/').slice(0, -1).join('/'));
    if (!existsSync(fullPath)) {
      ensureDirSync(fullPath);
    }

    writeFileSync(join(OUT_DIR, `${key}.json`), JSON.stringify(item, undefined, 2), 'utf8');
    writeFileSync(join(OUT_DIR, `${key}.min.json`), JSON.stringify(item), 'utf8');
  }
}

console.log('Finish compile docs.');

function getPackageName(name: string) {
  // ignore src
  if (name.indexOf('\"src') === 0) {
    return 'root';
  }
  return name.split('/').slice(0, -1).join('/').replace(`\"`, '');
}

function toCamelcase(str: string) {
  return str.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
    if (p2) { return p2.toUpperCase(); }
    return p1.toLowerCase();
  });
}

function checkIfContainTagPrivate(de: DeclarationReflection): boolean {
  if (de.comment && de.comment.tags) {
    return de.comment.tags.some(_ => _['tag'] === 'docs-private');
  } else {
    return false;
  }
}

function checkIfIsMethodLifecycle(de: DeclarationReflection) {
  const hook = [
    'ngOnChanges',
    'ngOnInit',
    'ngDoCheck',
    'ngAfterContentInit',
    'ngAfterContentChecked',
    'ngAfterViewInit',
    'ngAfterViewChecked',
    'ngOnDestroy'
  ];
  return de.kindString === 'Method' && hook.some(_ => _ === de.name);
}

function methodTemplate(de: DeclarationReflection) {
  let args = '';
  if (de.signatures[0].parameters) {
    args += de.signatures[0].parameters.map(_ => `${_.name}${_.flags.isOptional ? '?' : ''}: ${getType(_.type, 'any')}`).join(', ');
  }
  return `${de.name}(${args}): ${getType(de.type)}`;
}

function getType(ty: ParameterReflection['type'], defaultType = 'void') {
  if (ty) {
    if (ty.type === 'stringLiteral') {
      return `'${ty['value']}'`;
    } else if (ty.type === 'intrinsic' || ty.type === 'reference') {
      return ty['name'];
    } else if (ty.type === 'union') {
      return (ty['types'] as any[]).map(_ => getType(_, defaultType)).join(' | ');
    }
  }
  return defaultType;
}

function createDescription(comment: Reflection['comment']) {
  if (comment && comment.shortText) {
    const newText = (comment.shortText);
    const isMultiline = newText.split(/\n/g).length > 1;
    const lineStart = isMultiline ? `\n *` : '';
    const lineEnd = isMultiline ? `\n` : '';
    return newText ? `/**${lineStart} ${newText.replace(/\n/g, `\n * `)}${lineEnd} */` : '';
  }
  return '';
}
