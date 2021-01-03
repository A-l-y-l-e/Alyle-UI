/**
 * Generate templates
 */

import * as ts from 'typescript';
import { writeFileSync, readFileSync, promises } from 'fs';
import { join, dirname } from 'path';

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



(async () => {
  if (!process.argv.slice(-1).includes('start')) {
    return;
  }
  const docsJSON: ProjectReflection = JSON.parse(readFileSync(join(process.cwd(), 'dist/docs.json')).toString());
  const OUT_DIR = join(process.cwd(), `src/api/@alyle/ui`);
  const APIList: DocsPackage[] = [];

  for await (const child of docsJSON.children!) {

    if (child.children) {
      const pkgName = getPackageNameFromPath(child.name);
      const file = join(child.sources![0].fileName);

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
              // Ignore weird names
              if (!/^[\w]+$/.test(name)) {
                console.log(`${name} is a name invalid, ignoring`);
                continue;
              }
              const fileContent = readFileSync(file).toString('utf8');
              const source = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);
              if (_child.flags.isExported) {
                (API.items as PkgSymbol[]).push({
                  pkg: pkgName,
                  name,
                  symbol
                });
              }
              const nods = getNode(source, [name]);
              let scriptBlock = '';
              nods.forEach((nod) => {
                if (ts.isFunctionDeclaration(nod!)) {
                  (nod.body as any) = undefined;
                  const printer = ts.createPrinter({
                    newLine: ts.NewLineKind.LineFeed,
                    omitTrailingSemicolon: true
                  });
                  scriptBlock += printer.printNode(ts.EmitHint.Unspecified, nod, source) + `\n`;
                } else if (name.toLowerCase() === 'styles') {
                  scriptBlock += nod!.getFullText().trim() + `\n`;
                } else if (ts.isClassDeclaration(nod!)) {
                  (nod.members as any) = ts.factory.createNodeArray(
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
                      (mem.body as any) = undefined;
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
              const newContent = {
                pkg: pkgName,
                name,
                symbol,
                code: highlight(scriptBlock.trim(), 'ts')
              };
              const outDir = join(OUT_DIR, pkgName.replace('@alyle/ui', ''));
              await mkdir(outDir, { recursive: true });
              await writeFile(join(outDir, `${name}.json`), JSON.stringify(newContent, null, 2));

            } else {
              console.log(Type, name, 'ignoring');
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
    await writeFile(newPath, JSON.stringify(pkg, null, 2));
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

export function getPackageNameFromPath(nam: string) {
  nam = nam.replace(/"/g, '');
  if (nam.startsWith('src/lib/src')) {
    return '@alyle/ui';
  } else if (nam.startsWith('src/lib/themes')) {
    return `@alyle/ui/themes/${dirname(nam).split('/').slice(-1)[0]}`;
  }
  return '@alyle/ui/' + dirname(nam).split('/').slice(-1)[0];
}

function toCamelcase(str: string) {
  return str.replace(/^([A-Z])|\s(\w)/g, function(_match, p1, p2, _offset) {
    if (p2) { return p2.toUpperCase(); }
    return p1.toLowerCase();
  });
}

function checkIfContainTagPrivate(refl: DeclarationReflection): boolean {
  const comment: Reflection['comment'] = refl.comment
    || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0].comment : undefined);
  if (comment && comment.tags) {
    return comment.tags.some(_ => _['tag'] === 'docs-private');
  } else {
    return false;
  }
}
function hasTag(refl: DeclarationReflection, tag: string): boolean {
  const comment: Reflection['comment'] = refl.comment
    || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0].comment : undefined);
  if (comment && comment.tags) {
    return comment.tags.some(_ => _['tag'] === tag);
  } else {
    return false;
  }
}
