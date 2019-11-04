import anyTest, { TestInterface } from 'ava';
import { hasLylStyle, styleCompiler } from './compiler';
import { styleTemplateToString, StyleCollection, normalizeStyleTemplate } from '../src/parse';
const test = anyTest as TestInterface<Context>;
import * as tsNode from 'ts-node';

class Context {
  style = `
  const style = lyl \`{
    color: red
  }\`
  style('.y')`;

  fnThatReturnsStyleAStyle = `const style = () => lyl \`{
    color: blue
  }\`
  style('.y')`;

  styleWithExpressions = `const zero = 0;
  const item = lyl \`{
    top: \${zero}
    left: \${
      (5 * 8 + 1 + zero)
    }px
    right: \${
      1 + 1 === 2
        ? '2px'
        : 0
    }
  }\`;
  item('.y')
  `;

  inheritanceStyle = `
  ${styleTemplateToString}\n
  ${StyleCollection}
  ${normalizeStyleTemplate}
  const colorBlue = () => lyl \`{
    color: blue
  }\`
  const zero = 0;
  const item = lyl\`{
    top: \${zero}
    ...\${colorBlue}
  }\`;
  item('.y')
  `;

  simpleStyle = `
  import { LyTheme2, LyHostClass, lyl } from '@alyle/ui';

  const style = lyl \`{
    color: red
  }\`;
  `;

  complexStyle = `
  import { LyTheme2, LyHostClass, lyl } from '@alyle/ui';

  const style = lyl \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `;

  simpleAndComplexStyle = `
  import { LyTheme2, LyHostClass, lyl } from '@alyle/ui';

  const topZero = lyl \`{
    top: 0
  }\`
  const style = lyl \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `;

  simpleStyleNoCompile = `
  import { LyTheme2, LyHostClass, lyl as styleBlock } from '@alyle/ui';

  const topZero = styleBlock \`{
    top: 0
  }\`
  `;

  complexStyleNoCompile = `
  import { LyTheme2, LyHostClass, lyl as styleBlock } from '@alyle/ui';

  const topZero = styleBlock \`{
    top: 0
  }\`
  const style = styleBlock \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `;

  complexStyleNoCompileAndSimpleStyle = `
  import { LyTheme2, LyHostClass, lyl, lyl as styleBlock } from '@alyle/ui';

  const topZero = lyl \`{
    top: 0
  }\`
  const style = styleBlock \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `;

  stylesTest = `lyl \`{
    \${\`color: \${sColor}\`}
    \${\`background: \${sBackground}\`}
    \${\`border: \${sBorder}\`}
    \${\`pointer-events: \${sPointerEvents}\`}
    \${\`box-shadow: \${sBoxShadow}\`}
    &:active {
      \${sBoxShadowActive && \`box-shadow: \${sBoxShadowActive}\`}
    }
  }\`;`;

  styles = `
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LyTheme2, LyHostClass, lyl } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';

const zero = 0;

const topZero = lyl \`{
  top: \${zero}px
}\`;

const colorRedAndTopZero = lyl \`{
  color: red
  {
    ...\${item0}
  }
}\`;

const item2 = lyl \`{
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
`;

  simpleMediaQuery = `const style = lyl \`{
    color: red
    @media (max-width: 599px) {
      color: blue
    }
  }\`
  style('.y')`;

  complexMediaQuery = `const style = lyl \`{
    color: red
    @media (max-width: 599px) {
      color: blue
      .item {
        color: purple
      }
    }
  }\`
  style('.y')`;

}


test.before(t => {
  t.context = new Context();
});

test('should contain a lyl style', t => {
  t.true(hasLylStyle(t.context.style));
  t.true(hasLylStyle(t.context.fnThatReturnsStyleAStyle));
});

test(`should be equal to .y{color: red;}`, async t => {
  const css = await evalScript(t.context.style);
  t.is(`.y{color: red;}`, css);
});

test(`a StyleFn should be equal to .y {color: blue;}`, async t => {
  const css = await evalScript(t.context.fnThatReturnsStyleAStyle);
  t.is(`.y{color: blue;}`, css);
});

test(`compile style that contains an expression`, async t => {
  const css = await evalScript(t.context.styleWithExpressions);
  t.is(`.y{top: 0;left: 41px;right: 2px;}`, css);
});

test(`compile style with inheritance`, async t => {
  const css = await evalScript(t.context.inheritanceStyle);
  t.log(css);
  t.is(css, `.y{top: 0;}.y{color: blue;}`);
});

test(`compile simple style`, async t => {
  const css = styleCompiler(t.context.simpleStyle);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass } from '@alyle/ui';

  const style = (className: string) => \`\${className}{color: red;}\`;
  `);
});

test(`compile complex style`, async t => {
  const css = styleCompiler(t.context.complexStyle);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass,
  styleTemplateToString } from '@alyle/ui';

  const style = (className: string) => \`\${className}{color: red;}\${styleTemplateToString((
      topZero), \`\${className}\`)}\`;
  `);
});

test(`compile simple and complex style`, async t => {
  const css = styleCompiler(t.context.simpleAndComplexStyle);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass,
  styleTemplateToString } from '@alyle/ui';

  const topZero = (className: string) => \`\${className}{top: 0;}\`
  const style = (className: string) => \`\${className}{color: red;}\${styleTemplateToString((
      topZero), \`\${className}\`)}\`;
  `);
});

test(`do not compile a simple style`, t => {
  const css = styleCompiler(t.context.simpleStyleNoCompile);
  t.is(css, t.context.simpleStyleNoCompile);
});

test(`do not compile a complex style`, t => {
  const css = styleCompiler(t.context.complexStyleNoCompile);
  t.is(css, t.context.complexStyleNoCompile);
});

test(`do not compile a complex style with simple style`, t => {
  const css = styleCompiler(t.context.complexStyleNoCompileAndSimpleStyle);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass,
  lyl as styleBlock } from '@alyle/ui';

  const topZero = (className: string) => \`\${className}{top: 0;}\`
  const style = styleBlock \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `
  );
});

test(`compile styles`, t => {
  const css = styleCompiler(t.context.styles);
  // tslint:disable
  t.is(css, `
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LyTheme2,
  LyHostClass,
  styleTemplateToString } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';

const zero = 0;

const topZero = (className: string) => \`\${className}{top: \${zero}px;}\`;

const colorRedAndTopZero = (className: string) => \`\${className}{color: red;}\${styleTemplateToString((item0), \`\${className}\`)}\`;

const item2 = (className: string) => \`\${styleTemplateToString((item), \`\${className}\`)}\${className} ul{margin: 0;padding: \${zero};list-style: none;}\${styleTemplateToString((item), \`\${className} ul\`)}\${className} li a{display: inline-block;}\${className} a{display: block;padding: 6px \${12}px;text-decoration: none;}\${className} ul > li{list-style-type: none;}\${className} h2 + p{border-top: 1px solid gray;}\${className} p ~ span{opacity: 0.8;}\`;
`);
// tslint:enable
});

test(`compile simple media query`, async t => {
  const css = evalScript(t.context.simpleMediaQuery);
  t.is(css, `.y{color: red;}@media (max-width: 599px){.y{color: blue;}}`);
});

test(`compile complex media query`, async t => {
  const css = evalScript(t.context.complexMediaQuery);
  t.is(css, `.y{color: red;}@media (max-width: 599px){.y{color: blue;}}@media (max-width: 599px){.y .item{color: purple;}}`);
});

function evalScript(script: string) {
  // tslint:disable-next-line: no-eval
  return eval(tsNode.register({
    compilerOptions: {
      module: 'commonjs',
      sourceMap: false
    }
  }).compile(styleCompiler(script), 'file.ts'));
}