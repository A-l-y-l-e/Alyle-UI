import * as ts from 'typescript';
import { getNodes } from './util/util';
import { LylParse } from './parse';

const REGEX_LY = /(?:\(\)\s=>\s)?lyl\s?`({*[^]*?})`/g;
const REGEX_LY_STYLE_SHEET = /const[^{]+({{{[^{{]*(?:{(?!{{)[^{}]*|}(?!}})[^{}]*)*}}})/g;

console.log('starting..');

const fileContent = `
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LyTheme2, LyHostClass } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';
import { AUIRoutesMap } from '../routes';

function lyl(_literals: TemplateStringsArray, ..._placeholders: any[]) {
  return '';
}

const item = lyl\`{
  color: red
}\`;

const item2 = lyl\`{
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
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
    button: () => lyl \`{
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

function styleNotIsObjectLiteralExpression() {
  return Error(`The style must return an object literal expression.`);
}

export default function StyleCompiler(content: string) {
  // const getInsideDoubleCurly = (str: string) => str.split('{{{')
  //   .filter(val => val.includes('}}}'))
  //   .map(val => val.substring(0, val.indexOf('}}}')));

  let result = content.replace(REGEX_LY, (_ex, styleBlock) => {
    console.log('lyl', {styleBlock});
    console.log('lyl', {styleBlock: new LylParse(styleBlock).toCss()});
    return styleBlock;
  });

  result = result.replace(REGEX_LY_STYLE_SHEET, (_ex, styleBlock: string, _offset) => {
    styleBlock = styleBlock.slice(3, styleBlock.length - 3);
    const source = ts.createSourceFile('', styleBlock, ts.ScriptTarget.Latest, true);

    // console.log('test: ', {
    //   styleBlock
    // });

    let returnStatement: ts.ReturnStatement | null;

    source.forEachChild((node => {
      if (!returnStatement && ts.isReturnStatement(node)) {
        returnStatement = node;
        const childrenNode = getNodes(node).filter(ts.isObjectLiteralExpression);
        if (childrenNode.length) {
          // console.log('isReturnStatement', childrenNode[0].getFullText());
          // const objectLiteralExpression = childrenNode[0];
          // objectLiteralExpression.forEachChild(n => {

          // });
        } else {
          throw styleNotIsObjectLiteralExpression();
        }
      }
    }));
    return `${styleBlock}`;
  }).replace(REGEX_LY, (_ex, styleBlock, _offset) => {
    return `${styleBlock}`;
  });

  return result;
}

// tslint:disable-next-line: no-unused-expression
StyleCompiler(fileContent);

// function taggedTemplateToString(node: ts.TaggedTemplateExpression | ts.ArrowFunction) {
//   if (ts.isTaggedTemplateExpression(node)) {
//     return new LylParse(node.template.getText());
//   }
//   const template = (node.body as ts.TaggedTemplateExpression).template.getText();
//   return new LylParse(template);
// }
