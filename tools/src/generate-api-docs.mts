import ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { Application, TypeDocReader, TSConfigReader, ProjectReflection, DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';

import { highlight } from './html-loader/highlight.mjs';
import { hashCode } from './utils/hash-code.mjs';
const { readFile, mkdir, writeFile } = fs.promises;

interface PkgSymbol {
  pkg: string;
  name: string;
  symbol: string;
}

interface DocsPackage {
  pkg: string;
  items: PkgSymbol[] | { key: string, items: PkgSymbol[]}[];
}

const OUT_DIR = path.join(process.cwd(), `src/api/@alyle/ui`);
const APIList: DocsPackage[] = [];
console.log('Starting...');

async function generateJson() {
  const packagesPaths = await getPackagePaths();
  console.log(packagesPaths);

  const app = await Application.bootstrap({
    entryPoints: packagesPaths.map((pkg) => pkg.path),
    entryPointStrategy: 'expand',
    tsconfig: 'tsconfig.td.json',
    excludeExternals: "true",
    excludeInternal: "true",
    excludePrivate: "true",
  });

  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());

  const project = await app.convert();

  if (project) {
    const outputDir = path.join('dist/api-docs');
    await app.generateJson(project, path.join(outputDir, 'documentation.json'));
  }
}

async function render() {
  const docs = await getDocs();
  for (const child of docs.children!) {
    if (!child.children) {
      continue;
    }
    if (!child.sources || !child.sources[0]) {
      console.warn(chalk.yellow(`Skipping child without source: ${child.name}`));
      continue;
    }
    let pkgName = child.sources[0].fileName.replace(/src\/lib/, '@alyle/ui');
    pkgName = path.dirname(pkgName);
    console.log(child.sources![0]!.fileName);
    pkgName = pkgName.endsWith('/') ? pkgName.slice(0, -1) : pkgName;
    console.log(chalk.greenBright(`\nPackage: ${pkgName}`));
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
    for (const _child of child.children) {
      if (!_child.sources || !_child.sources[0]) {
        console.warn(chalk.yellow(`Skipping entry without source: ${_child.name}`));
        continue;
      }
      const file = _child.sources[0].fileName;
      const { name, kind } = _child;
      const decorators = (_child as any).decorators || null;
      const kindString = ReflectionKind[kind];
      const type = decorators
        ? decorators[0]!.name
        : (kindString! === 'Variable' ? 'Const' : kindString!);
      const symbol = hasTag(_child, 'decorator')
        ? 'Decorator'
        : decorators
          ? decorators[0]!.name
          : _child.flags.isConst
            ? 'Const'
            : (kindString! === 'Variable' ? 'Const' : kindString!);
      // const Type = `${toCamelcase(type)}List`;
      if (
        !checkIfContainTagPrivate(_child) && !hasTag(_child, 'docsPrivate') && !name.startsWith('_')
      ) {
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
            continue;
          }
          const fileContent = await readFile(file, 'utf8');
          const source = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);
          (API.items as PkgSymbol[]).push({
            pkg: pkgName,
            name,
            symbol
          });
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
            code: highlight(removeLifecycleHook(scriptBlock.trim()), 'ts')
          };
          const outDir = path.join(OUT_DIR, pkgName.replace('@alyle/ui', ''));
          const outName = `${name}_${hashCode(name).toString(36)}`;
          const out = path.join(outDir, `${outName}`);
          await mkdir(outDir, { recursive: true });
          await writeFile(out, JSON.stringify(newContent, null, 2));
          console.log(`  JSON written to .${out.slice(process.cwd().length)}`);

        }
      }
    }
  }

  let list = APIList.sort(sortAPIList);
  list = list.map(pkg => (pkg.items = (pkg.items as PkgSymbol[]).sort(sortAPIListItem), pkg));

  mkdir(OUT_DIR, {
    recursive: true
  });
  await writeFile(path.join(OUT_DIR, 'APIList.json'), JSON.stringify(list, null, 2), 'utf8');
  await writeFile(path.join(OUT_DIR, 'APIList.min.json'), JSON.stringify(list), 'utf8');
  console.log(chalk.greenBright(`\nList`));
  list.forEach(async (pkg) => {
    const newPath = path.join(OUT_DIR, pkg.pkg.replace('@alyle/ui', '') + '.json')
      .replace('/.json', '.json');
    const filenameWithoutExt = path.basename(newPath, '.json');
    const fullPath = path.join(path.dirname(newPath), `${filenameWithoutExt}_${hashCode(filenameWithoutExt).toString(36)}`);
    pkg.items = groupBy(pkg.items as PkgSymbol[], 'symbol');
    await writeFile(fullPath, JSON.stringify(pkg, null, 2));
    console.log(`  JSON written to .${fullPath.slice(process.cwd().length)}`);
  });
}


(async () => {
  await generateJson();
  await render();
})().catch((error) => {
  console.log(error);
  throw new Error(error);
});

function groupBy<T>(xs: T[], key: string): { key: string, items: T[]}[] {
  return xs.reduce((rv, x: any) => {
    const item = rv.find((a) => a.key === x[key])
      || ((!!rv.push({
        key: x[key],
        items: []
      }) as true /** <-- This always returns true, since an item is never removed */)
      && rv[rv.length - 1]);
    item!.items.push(x);
    return rv;
  }, [] as { key: string, items: T[]}[]);
}

function sortAPIListItem(a: { name: string }, b: { name: string }) {
  return (a.name).toLowerCase() > (b.name).toLowerCase() ? 1 : (a.name).toLowerCase() < (b.name).toLowerCase() ? -1 : 0;
}
function sortAPIList(a: { pkg: string }, b: { pkg: string }) {
  return (a.pkg).toLowerCase() > (b.pkg).toLowerCase() ? 1 : (a.pkg).toLowerCase() < (b.pkg).toLowerCase() ? -1 : 0;
}

async function getPackagePaths() {
  const raw = await readFile('tsconfig.json', 'utf8');
  const tsconfig = JSON.parse(raw);
  const paths = tsconfig.compilerOptions.paths;
  return Object.keys(paths)
    .filter(key => key.startsWith('@alyle/ui') && key !== '@alyle/ui/schematics/testing')
    .map(key => ({
      name: key,
      path: `${paths[key][0]}/index.ts` as string
    }));
}

async function getDocs() {
  const fileContent = await readFile(path.join(process.cwd(), 'dist/api-docs/documentation.json'), 'utf8');
  const docsJSON: ProjectReflection = JSON.parse(fileContent);
  return docsJSON;
}

function hasTag(refl: DeclarationReflection, tag: string): boolean {
  const comment: Reflection['comment'] = refl.comment
    || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0]!.comment : undefined);
  if (comment && 'tags' in comment) {
    return Array.isArray(comment.tags) && comment.tags.some((_: any) => _.tag === tag);
  } else {
    return false;
  }
}

function checkIfContainTagPrivate(refl: DeclarationReflection): boolean {
  const comment: Reflection['comment'] = refl.comment
    || (refl['signatures'] && refl['signatures'].length ? refl['signatures'][0]!.comment : undefined);
  if (comment && 'tags' in comment) {
    return Array.isArray(comment.tags) && comment.tags.some((_: any) => _.tag === 'docs-private');
  } else {
    return false;
  }
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

function removeLifecycleHook(code: string) {
  const regex = /[\ ]+(ngOnChanges|ngOnInit|ngDoCheck|ngAfterContentInit|ngAfterContentChecked|ngAfterViewInit|ngAfterViewChecked|ngOnDestroy)\(\)\n/g;
  return code.replace(regex, '');
}
