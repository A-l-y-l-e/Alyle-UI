import * as ts from 'typescript';
import { findNode } from './util/util';
import { LylParse } from '../src/parse';

const REGEX_LY = /(?:\(\)\s=>\s)?(?:[\w]+\.)?lyl\s?(`{{*[^]*?}`)/g;
// const REGEX_LY_STYLE_SHEET = /const[^{]+({{{[^{{]*(?:{(?!{{)[^{}]*|}(?!}})[^{}]*)*}}})/g;
const LYL_BAD_REGEX = /^{\n\s\*\s/;
const REPLACE_ID_REGEX = /\[ei([\w]+)\]/g;
const REPLACE_IMPORT_LYL = /import {[^}]*(lyl)[^}]*} from '@alyle\/ui';?/g;

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

const zero = 0;

const item0 = lyl\`{
  prop: \${zero}px
}\`;

const item = lyl\`{
  color: red
  {
    ...\${item0}
  }
}\`;

const item2 = lyl\`{
  {
    ...\${item}
  }
  ul {
    margin: 0
    padding: \${zero}
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
    padding: 6px \${12}px;
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
  let requiresRemovingLyl: boolean = false;
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

    requiresRemovingLyl = true;

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

  if (requiresRemovingLyl) {
    return result
      .replace(REPLACE_IMPORT_LYL, (full: string, item: string) => {
        /**
         * e.g. this is ignored
         * import { lyl as lylCompiler } from '@alyle/ui';
         */
        if (full.includes('lyl as ')) {
          return full;
        }
        return full.replace(item, 'styleTemplateToString');
      });
  }
  return result;
}

// tslint:disable-next-line: no-unused-expression
const compiled = StyleCompiler(fileContent);
console.log(compiled);


function createUniqueID(count: number) {
  const ID = `${count}${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `[ei${ID}]`;
}
