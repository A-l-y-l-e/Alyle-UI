/**
 * Generate templates
 */

import * as ts from 'typescript';
import { writeFileSync, readFileSync, promises } from 'fs';
import { join } from 'path';

import { ProjectReflection, DeclarationReflection, Reflection } from 'typedoc';
import { ensureDirSync } from 'fs-extra';
import { highlight } from './html-loader/loader';

const { writeFile, mkdir } = promises;

interface PkgSymbol {
  pkg: string;
  name: string;
  symbol: string;
}

interface DocsPackage {
  pkg: string;
  items: PkgSymbol[] | { key: string, items: PkgSymbol[]}[];
}


const docsJSON: ProjectReflection = JSON.parse(readFileSync(join(process.cwd(), 'dist/docs.json')).toString());

const OUT_DIR = join(process.cwd(), `src/api/@alyle/ui`);

const APIList: DocsPackage[] = [];

(async () => {
  for await (const child of docsJSON.children!) {

    if (child.children) {
      const pkgName = join('@alyle/ui', getPackageName(child.name));
      const file = join('src/lib', child.sources![0].fileName);

      let API = APIList.find(api => api.pkg === pkgName);

      /**
       * if not exist add defaults
       */
      if (!API) {
        API = {
          pkg: pkgName,
          items: []
        };
        APIList.push(API);
      }

      for await (const _child of child.children) {

        const { name, decorators, kindString } = _child;
        const type = decorators ? decorators[0].name : kindString!;
        const symbol = hasTag(_child, 'decorator')
          ? 'Decorator'
          : decorators
            ? decorators[0].name
            : _child.flags.isConst
              ? 'Const'
              : kindString!;

        const Type = `${toCamelcase(type)}List`;

        if (
          (_child.flags.isExported || (kindString === 'Variable' && _child.flags.isConst))
          && !checkIfContainTagPrivate(_child) && !hasTag(_child, 'docsPrivate') && !name.startsWith('_')
        ) {
          if (_child.flags.isExported) {
            if (
              symbol === 'Const'
              || type === 'Function'
              || type === 'Class'
              || type === 'Component'
              || type === 'Directive'
              || type === 'Enumeration'
              || type === 'NgModule'
              || type === 'Interface'
              || type === 'Type alias'
              || type === 'Injectable'
            ) {
              if (_child.flags.isExported) {
                (API.items as PkgSymbol[]).push({
                  pkg: pkgName,
                  name,
                  symbol
                });
              }
              const fileContent = readFileSync(file).toString('utf8');
              const source = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);
              if (!/^[\w]+$/.test(name)) {
                console.log(`${name} is a name invalid, ignoring`);
                continue;
              }
              const nods = getNode(source, [name]);
              console.log(name, type, nods.length);
              let scriptBlock = '';
              nods.forEach((nod) => {
                if (ts.isFunctionDeclaration(nod!)) {
                  nod.body = undefined;
                  const printer = ts.createPrinter({
                    newLine: ts.NewLineKind.LineFeed,
                    omitTrailingSemicolon: true
                  });
                  scriptBlock += printer.printNode(ts.EmitHint.Unspecified, nod, source) + `\n`;
                } else if (name.toLowerCase() === 'styles') {
                  scriptBlock += nod!.getFullText().trim() + `\n`;
                } else if (ts.isClassDeclaration(nod!)) {
                  nod.members = ts.createNodeArray(
                    nod.members
                      .filter(mem => !/@docs-private|docsPrivate|internal/.test(mem.getFullText()))
                      // Ignore [0x1]
                      .filter(mem => !mem.getText().startsWith('['))
                      // Ignore private
                      .filter(mem => !mem.getText().startsWith('private'))
                      // Ignore _property
                      .filter(mem => {
                        if (ts.isGetAccessor(mem)
                        || ts.isSetAccessor(mem)
                        || ts.isMethodDeclaration(mem)
                        || ts.isPropertyDeclaration(mem)) {
                          return !mem.name.getText().startsWith('_');
                        }
                        return true;
                      })
                      // Ignore constructor
                      .filter(mem => !(mem.kind === ts.SyntaxKind.Constructor)));
                  nod.members.forEach(mem => {
                    if (
                      ts.isGetAccessor(mem)
                      || ts.isSetAccessor(mem)
                      || ts.isMethodDeclaration(mem)
                    ) {
                      mem.body = undefined;
                    }
                  });
                  const printer = ts.createPrinter({
                    newLine: ts.NewLineKind.LineFeed
                  });
                  scriptBlock += printer.printNode(ts.EmitHint.Unspecified, nod, source) + `\n`;
                  scriptBlock = scriptBlock.replace(/;\n/g, '\n');
                } else {
                  scriptBlock = nod.getFullText();
                }
              });
              // if (findNodes(nod!, ts.SyntaxKind.FunctionDeclaration, 1)[0]) {
              //   findNodes(nod!, ts.SyntaxKind.FunctionDeclaration).forEach((n: ts.FunctionDeclaration) => {
              //     n.body = undefined;
              //     delete n.body;
              //   });
              //   console.log(nod!.getFullText());
              // }
              const newContent = {
                pkg: pkgName,
                name,
                symbol,
                code: highlight(scriptBlock.trim(), 'ts')
              };
              const outDir = join(OUT_DIR, pkgName.replace('@alyle/ui', ''));
              await mkdir(outDir, { recursive: true });
              await writeFile(join(outDir, `${name}.json`), JSON.stringify(newContent));

            } else {
              console.log(Type, name);
            }
          }
        }
      }
    }
  }

  let list = APIList.sort(sortAPIList);
  list = list.map(pkg => (pkg.items = (pkg.items as PkgSymbol[]).sort(sortAPIListItem), pkg));

  ensureDirSync(OUT_DIR);
  writeFileSync(join(OUT_DIR, 'APIList.json'), JSON.stringify(list, undefined, 2), 'utf8');
  writeFileSync(join(OUT_DIR, 'APIList.min.json'), JSON.stringify(list), 'utf8');

  list.forEach(async (pkg) => {
    const newPath = join(OUT_DIR, pkg.pkg.replace('@alyle/ui', '') + '.json')
      .replace('/.json', '.json');
    pkg.items = groupBy(pkg.items as PkgSymbol[], 'symbol');
    await writeFile(newPath, JSON.stringify(pkg));
  });

  console.log('Finish compile docs.');

})();

// Sort
function sortAPIListItem(a: { name: string }, b: { name: string }) {
  return (a.name).toLowerCase() > (b.name).toLowerCase() ? 1 : (a.name).toLowerCase() < (b.name).toLowerCase() ? -1 : 0;
}
function sortAPIList(a: { pkg: string }, b: { pkg: string }) {
  return (a.pkg).toLowerCase() > (b.pkg).toLowerCase() ? 1 : (a.pkg).toLowerCase() < (b.pkg).toLowerCase() ? -1 : 0;
}
function groupBy<T>(xs: T[], key: string): { key: string, items: T[]}[] {
  return xs.reduce((rv, x) => {
    const item = rv.find((a) => a.key === x[key])
      || ((!!rv.push({
        key: x[key],
        items: []
      }) as true /** <-- This always returns true, since an item is never removed */)
      && rv[rv.length - 1]);
    item.items.push(x);
    return rv;
  }, [] as { key: string, items: T[]}[]);
}


// console.log(JSON.stringify(APIList, undefined, 2));
// console.log(JSON.stringify(APIListLarge, undefined, 2));

function getNode(node: ts.Node, keys: string[], foundNodes: ts.Node[] = []): ts.Node[] {
  if (!keys.length) {
    return foundNodes;
  }
  keys = keys.slice(0);
  const re = new RegExp(
    /(export )?(class|abstract class|const|function|enum|interface|type) /.source + keys[0] + /[\W]/.source);
  if (
    re.test(node.getText())
    && !ts.isSourceFile(node)
    && !(node.kind === ts.SyntaxKind.SyntaxList)
  ) {
    keys.shift();
    foundNodes.push(node);
    return foundNodes;
  }
  const nodes = ts.isSourceFile(node) ? Array.from(node.statements) : node.getChildren();
  for (const child of nodes) {
    getNode(child, keys, foundNodes);
  }
  return foundNodes;
}

function getPackageName(name: string) {
  // ignore src
  if (name.indexOf('\"src') === 0) {
    return '';
  }
  return name.split('/').slice(0, -1).join('/').replace(`\"`, '');
}

function toCamelcase(str: string) {
  return str.replace(/^([A-Z])|\s(\w)/g, function(_match, p1, p2, _offset) {
    if (p2) { return p2.toUpperCase(); }
    return p1.toLowerCase();
  });
}

function checkIfContainTagPrivate(refl: DeclarationReflection): boolean {
  const comment: Reflection['comment'] = refl.comment || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0].comment : undefined);
  if (comment && comment.tags) {
    return comment.tags.some(_ => _['tag'] === 'docs-private');
  } else {
    return false;
  }
}
function hasTag(refl: DeclarationReflection, tag: string): boolean {
  const comment: Reflection['comment'] = refl.comment || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0].comment : undefined);
  if (comment && comment.tags) {
    return comment.tags.some(_ => _['tag'] === tag);
  } else {
    return false;
  }
}

// function checkIfIsMethodLifecycle(de: DeclarationReflection) {
//   const hook = [
//     'ngOnChanges',
//     'ngOnInit',
//     'ngDoCheck',
//     'ngAfterContentInit',
//     'ngAfterContentChecked',
//     'ngAfterViewInit',
//     'ngAfterViewChecked',
//     'ngOnDestroy'
//   ];
//   return de.kindString === 'Method' && hook.some(_ => _ === de.name);
// }

// function methodTemplate(de: DeclarationReflection) {
//   let args = '';
//   if (de.signatures && de.signatures[0].parameters) {
//     args += de.signatures[0].parameters.map(_ => `${_.name}${_.flags.isOptional ? '?' : ''}: ${getType(_.type, 'any')}`).join(', ');
//   }
//   return `${de.name}(${args}): ${getType(de.type)}`;
// }

// function getType(ty: ParameterReflection['type'], defaultType = 'void'): string {
//   if (ty) {
//     if (ty.type === 'stringLiteral') {
//       return `'${ty['value']}'`;
//     } else if (ty.type === 'intrinsic' || ty.type === 'reference') {
//       return ty['name'];
//     } else if (ty.type === 'union') {
//       return (ty['types'] as any[]).map(_ => getType(_, defaultType)).join(' | ');
//     }
//   }
//   return defaultType;
// }

// function createDescription(refl: Reflection) {
//   const comment: Reflection['comment'] = refl.comment || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0].comment : null);
//   if (comment && comment.shortText) {
//     const newText = (comment.shortText);
//     const isMultiline = newText.split(/\n/g).length > 1;
//     const lineStart = isMultiline ? `\n *` : '';
//     const lineEnd = isMultiline ? `\n` : '';
//     return newText ? `/**${lineStart} ${newText.replace(/\n/g, `\n * `)}${lineEnd} */` : '';
//   }
//   return '';
// }

// function createClassContent(children: DeclarationReflection[]): string {
//   const items: string[] = [];
//   children.forEach(de => {
//     if (!(
//       de.name.startsWith('_') || checkIfContainTagPrivate(de) ||
//       checkIfIsMethodLifecycle(de)
//     )) { // ignore names that start with '_'
//       const comment = createDescription(de);
//       if (comment) {
//         items.push(comment);
//       }
//       if (de.kindString === 'Property') {
//         let line = '';
//         if (de.decorators) {
//           de.decorators.forEach(_ => {
//               line += `@${_.name}() `;
//           });
//         }
//         line += `${de.name}: `;
//         line += de.type && de.type['name'] ? de.type['name'] : 'any';
//         items.push(line);
//       } else if (de.kindString === 'Accessor') {

//         let line = '';
//         if (de.decorators) {
//           de.decorators.forEach(_ => {
//             line += `@${_.name}(`;
//             if (_.arguments.bindingPropertyName) {
//               line += _.arguments.bindingPropertyName;
//             }
//             line += `) `;
//           });
//         }
//         line += `${de.name}: `;
//         line += `${de.getSignature && de.getSignature[0]
//         ? getType(de.getSignature[0].type, 'any')
//         : 'any'}`;
//         items.push(line);
//       } else if (de.kindString === 'Method') {
//         let line = '';
//         line += methodTemplate(de);
//         items.push(line);
//       }
//     }
//   });
//   return items.join(`\n`);
// }

// function getComponentOptions(decorators: Decorator[]) {
//   const _source = ts.createSourceFile('file.ts', `const data = ${decorators![0].arguments.obj}`, ts.ScriptTarget.Latest, true);
//   const props = findNodes(_source.getChildren()[0], ts.SyntaxKind.PropertyAssignment);
//   const properties = [
//     'selector',
//     'exportAs',
//     'inputs',
//     'providers'
//   ];
//   const __data: {
//     selector?: string
//     inputs?: string
//     exportAs?: string
//     providers?: string
//   } = {};
//   props
//   .filter(
//     (_: ts.PropertyAssignment) => properties.some(p => p === _.name.getText())
//   )
//   .forEach((cbNode: ts.PropertyAssignment) => {
//     const value = cbNode.getChildAt(2).getText();
//     if (cbNode.name.getText() === 'inputs') {
//       __data[cbNode.name.getText()] = highlight(
//         JSON.stringify(new Function(`return ${value}`)(), undefined, 2), 'ts');
//     } else {
//       __data[cbNode.name.getText()] = highlight(value, 'ts');
//     }
//   });
//   return __data;
// }
