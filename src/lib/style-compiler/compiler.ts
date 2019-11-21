import * as ts from 'typescript';
import { findNode } from './util/util';
import { LylParse } from '../src/parse';

const REGEX_LY = () => /(?:\( \)\s=>\s)?(?:[\w]+\.)?lyl\s?(`{{*[^]*?}`)/g;
const LYL_BAD_REGEX = /^{\n\s\*\s/;
const REPLACE_ID_REGEX = () => /\[ei([\w]+)\]/g;
const REPLACE_IMPORT_LYL = () => /import {[^}]*(lyl)[^}]*} from '[^']+';/g;

export function styleCompiler(content: string) {
  let simpleStyles = 0;
  let complexStyles = 0;

  const result = content.replace(REGEX_LY(), (_ex, styleBlock: string) => {
    if (LYL_BAD_REGEX.test(styleBlock)) {
      return _ex;
    }

    simpleStyles++;
    const source = ts.createSourceFile('', styleBlock, ts.ScriptTarget.Latest, true);
    const templateExpression = findNode(source, ts.SyntaxKind.TemplateExpression) as ts.TemplateExpression | null;
    if (!templateExpression) {
      const cssContent = new LylParse(styleBlock.slice(1, styleBlock.length - 1)).toCss();
      styleBlock = `(className: string) => \`${cssContent}\``;
      return styleBlock;
    }

    let nextID = 0;
    const data: {[key: string]: string} = {};
    const templates = [
      templateExpression.head.getFullText(),
      ...templateExpression.templateSpans
        .map(prop => {
          const id = createUniqueID(nextID++);
          data[id] = prop.expression.getFullText();
          return `${id}${prop.literal.getFullText().trim()}`;
        })
    ];

    const templateString = templates.join('');

    if (templateString.includes('...${')) {
      complexStyles++;
    }

    const css = new LylParse(
      templateString.slice(1, templateString.length - 1)
    ).toCss().replace(REPLACE_ID_REGEX(), (id: string) => data[id] || id);
    styleBlock = `(className: string) => \`${css}\``;
    return styleBlock;
  });

  return updateImport(result, simpleStyles, complexStyles);
}


function createUniqueID(count: number) {
  const ID = `${count}${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `[ei${ID}]`;
}

/**
 * If a string contains a lyl style
 * For testing purposes only
 * @param str content
 */
export function hasLylStyle(str: string) {
  return REGEX_LY().test(str);
}

function updateImport(content: string, numSimpleStyles: number, numComplexStyles: number) {
  if (!(numSimpleStyles || numComplexStyles)) {
    return content;
  }
  return content.replace(REPLACE_IMPORT_LYL(), (full: string) => {

    const source = ts.createSourceFile('', full, ts.ScriptTarget.Latest, true);
    const importDeclaration = findNode(source, ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration;
    let imports = (importDeclaration.importClause!.namedBindings as ts.NamedImports)!
      .elements.map((imp) => {
        return imp.getText();
      });
    const modulePath = importDeclaration.moduleSpecifier.getFullText();
    if ((numSimpleStyles && numComplexStyles) || numComplexStyles) {
      imports = imports.map(
        imp => imp === 'lyl' ? 'styleTemplateToString' : imp);
    } else if (numSimpleStyles) {
      imports = imports.filter(imp => imp !== 'lyl');
    }
    return `import {\n  ${imports.join(`,\n  `)} } from ${modulePath.trim()};`;
  });
}
