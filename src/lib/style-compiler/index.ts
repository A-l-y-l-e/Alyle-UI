import * as ts from 'typescript';
import { findNode } from './util/util';
import { LylParse } from '../src/parse';

const REGEX_LY = /(?:\(\)\s=>\s)?(?:[\w]+\.)?lyl\s?(`{{*[^]*?}`)/g;
// const REGEX_LY_STYLE_SHEET = /const[^{]+({{{[^{{]*(?:{(?!{{)[^{}]*|}(?!}})[^{}]*)*}}})/g;
const LYL_BAD_REGEX = /^{\n\s\*\s/;
const REPLACE_ID_REGEX = /\[ei([\w]+)\]/g;
const REPLACE_IMPORT_LYL = /import {[^}]*(lyl)[^}]*} from '@alyle\/ui';/;

console.log('starting..');

const fileContent = `
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LyTheme2, LyHostClass, lyl } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';
import { AUIRoutesMap } from '../routes';

function lyl(_literals: TemplateStringsArray, ..._placeholders: any[]) {
  return '';
}

const item = lyl\`{
  color: red
}\`;

const item2 = lyl\`{
  {
    ...\${item}
  }
  ul {
    margin: 0
    padding: 0
    list-style: none
    {
      ...\${item}
    }
  }


  li {
    a {
      display: inline-block;

    }
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }

  ul > {
    li {
      list-style-type: none
    }
  }

  h2 {
    + p {
      border-top: 1px solid gray
    }
  }

  p {
    ~ {
      span {
        opacity: 0.8
      }
    }
  }
}\`;

console.log(item, item2);

const STYLES = (theme: AUIThemeVariables) => {{{
  const key = () => 5;
  const aFn = function () {
    return 4;
  }
  return {
    root: {
      blockquote: {
        color: theme.text.secondary,
        borderLeft: \`3px solid \${theme.primary.default}\`,
        padding: '0 1em',
        margin: 0
      }
    },
    button: lyl \`{
      color: blue
    }\`,
    button: (someValue: string) => lyl \`{
      color: blue
    }\`
  };
}}};

// not
const STYLES = (theme: AUIThemeVariables) => {{{
  const key = () => 5;
  const aFn = function () {
    return 4;
  }
  return {
    root: {
      blockquote: {
        color: theme.text.secondary,
        borderLeft: \`3px solid \${theme.primary.default}\`,
        padding: '0 1em',
        margin: 0
      }
    }
  };
}}};

const commonConfigVariables = ['appearance', 'size', 'lyTyp'];
`;

// function styleNotIsObjectLiteralExpression() {
//   return Error(`The style must return an object literal expression.`);
// }

export function StyleCompiler(content: string) {

  const result = content.replace(REGEX_LY, (_ex, styleBlock: string) => {
    if (LYL_BAD_REGEX.test(styleBlock)) {
      return _ex;
    }

    const source = ts.createSourceFile('', styleBlock, ts.ScriptTarget.Latest, true);
    const templateExpression = findNode(source, ts.SyntaxKind.TemplateExpression) as ts.TemplateExpression | null;
    if (!templateExpression) {
      const cssContent = new LylParse(styleBlock.slice(1, styleBlock.length - 1)).toCss();
      styleBlock = `(className) => \`${cssContent}\``;
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
          return `${id}${prop.literal.getFullText()}`;
        })
    ];

    const templateString = templates.join('');

    const css = new LylParse(
      templateString.slice(1, templateString.length - 1)
    ).toCss().replace(REPLACE_ID_REGEX, (id: string) => data[id] || id);
    styleBlock = `(className) => \`${css}\``;
    return styleBlock;
  });

  // result = result.replace(REGEX_LY_STYLE_SHEET, (_ex, styleBlock: string, _offset) => {
  //   styleBlock = styleBlock.slice(3, styleBlock.length - 3);
  //   const source = ts.createSourceFile('', styleBlock, ts.ScriptTarget.Latest, true);

  //   let returnStatement: ts.ReturnStatement | null;

  //   source.forEachChild((node => {
  //     if (!returnStatement && ts.isReturnStatement(node)) {
  //       returnStatement = node;
  //       const childrenNode = getNodes(node).filter(ts.isObjectLiteralExpression);
  //       if (childrenNode.length) {
  //         // console.log('isReturnStatement', childrenNode[0].getFullText());
  //         // const objectLiteralExpression = childrenNode[0];
  //         // objectLiteralExpression.forEachChild(n => {

  //         // });
  //       } else {
  //         throw styleNotIsObjectLiteralExpression();
  //       }
  //     }
  //   }));
  //   return `${styleBlock}`;
  // });
  return result.replace(REPLACE_IMPORT_LYL, (full: string, item: string) => full.replace(item, 'styleTemplateToString'));
}

// tslint:disable-next-line: no-unused-expression
const compiled = StyleCompiler(fileContent);
console.log(compiled);

// function taggedTemplateToString(node: ts.TaggedTemplateExpression | ts.ArrowFunction) {
//   if (ts.isTaggedTemplateExpression(node)) {
//     return new LylParse(node.template.getText());
//   }
//   const template = (node.body as ts.TaggedTemplateExpression).template.getText();
//   return new LylParse(template);
// }

function createUniqueID(count: number) {
  const ID = `${count}${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `[ei${ID}]`;
}
