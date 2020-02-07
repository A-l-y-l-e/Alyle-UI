import anyTest, { TestInterface } from 'ava';
import { hasLylStyle, styleCompiler } from './compiler';
import {
  st2c,
  StyleCollection,
  st2c } from '../src/parse';
import * as tsNode from 'ts-node';

const test = anyTest as TestInterface<Context>;

class Context {
  style = `
  const style = lyl \`{
    color: red
  }\`
  style('.y')`;

  styleIntoObjectAsFunction = `${st2c}\n${StyleCollection}\nconst styles = {
    item: () => lyl \`{
      color: \${'blue'}
      ...\${null}
    }\`
  }
  styles.item()('.y')`;

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
  ${st2c}\n
  ${StyleCollection}
  const colorBlue = lyl \`{
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
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

  const style = lyl \`{
    color: red
  }\`;
  `;

  simpleStyle2 = `
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

  const style = lyl \`{
    color: red
  }\`;

  const style2 = lyl \`{
    color: blue
  }\`;
  `;

  complexStyle = `
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

  const style = lyl \`{
    color: red
    ...\${
      topZero
    }
  }\`;
  `;

  simpleAndComplexStyle = `
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

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
  import {
  LyTheme2,
  LyHostClass,
  lyl as styleBlock } from '@alyle/ui';

  const topZero = styleBlock \`{
    top: 0
  }\`
  `;

  complexStyleNoCompile = `
  import {
  LyTheme2,
  LyHostClass,
  lyl as styleBlock } from '@alyle/ui';

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
  import {
  LyTheme2,
  LyHostClass,
  st2c,
  lyl as styleBlock } from '@alyle/ui';

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
import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

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
      display: inline-block

    }
  }

  a {
    display: block
    padding: 6px \${12}px
    text-decoration: none
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

  keyframe = `
  const id = 'a';
  const keyframe = lyl \`{
    @keyframe \${id} {
      0% {
        color: red
      }
      100% {
        color: blue
      }
    }
  }\`
  keyframe('')`;

}


test.before(t => {
  t.context = new Context();
});

test('should contain a lyl style', t => {
  t.true(hasLylStyle(t.context.style));
  t.true(hasLylStyle(t.context.styleIntoObjectAsFunction));
});

test(`should be equal to .y{color: red;}`, async t => {
  const css = await evalScript(t.context.style);
  t.is(`.y{color:red;}`, css);
});

test(`a StyleFn should be equal to .y {color: blue;}`, async t => {
  t.log(t.context.styleIntoObjectAsFunction);
  const css = await evalScript(t.context.styleIntoObjectAsFunction);
  t.is(`.y{color:blue;}`, css);
});

test(`compile style that contains an expression`, async t => {
  const css = await evalScript(t.context.styleWithExpressions);
  t.is(`.y{top:0;left:41px;right:2px;}`, css);
});

test(`compile style with inheritance`, async t => {
  const css = await evalScript(t.context.inheritanceStyle);
  t.log(css);
  t.is(css, `.y{top:0;}.y{color:blue;}`);
});

test(`compile simple style`, async t => {
  const css = styleCompiler(t.context.simpleStyle);
  t.is(`
  import {
  LyTheme2,
  LyHostClass } from '@alyle/ui';

  const style = (className: string) => \`\${className}{color:red;}\`;
  `, css);
});

test(`compile simple styles in a file`, async t => {
  const css = styleCompiler(t.context.simpleStyle2);
  t.is(`
  import {
  LyTheme2,
  LyHostClass } from '@alyle/ui';

  const style = (className: string) => \`\${className}{color:red;}\`;

  const style2 = (className: string) => \`\${className}{color:blue;}\`;
  `, css);
});

test(`compile complex style`, async t => {
  const css = styleCompiler(t.context.complexStyle);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

  const style = (className: string) => \`\${className}{color:red;}\${st2c((
      topZero), \`\${className}\`)}\`;
  `);
});

test(`compile simple and complex style`, async t => {
  const css = styleCompiler(t.context.simpleAndComplexStyle);
  t.log(css);
  t.is(css, `
  import {
  LyTheme2,
  LyHostClass,
  st2c } from '@alyle/ui';

  const topZero = (className: string) => \`\${className}{top:0;}\`
  const style = (className: string) => \`\${className}{color:red;}\${st2c((
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

  const topZero = (className: string) => \`\${className}{top:0;}\`
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
  st2c } from '@alyle/ui';

import { AUIThemeVariables } from '@app/app.module';

const zero = 0;

const topZero = (className: string) => \`\${className}{top:\${zero}px;}\`;

const colorRedAndTopZero = (className: string) => \`\${className}{color:red;}\${st2c((item0), \`\${className}\`)}\`;

const item2 = (className: string) => \`\${st2c((item), \`\${className}\`)}\${className} ul{margin:0;padding:\${zero};list-style:none;}\${st2c((item), \`\${className} ul\`)}\${className} li a{display:inline-block;}\${className} a{display:block;padding:6px \${12}px;text-decoration:none;}\${className} ul > li{list-style-type:none;}\${className} h2 + p{border-top:1px solid gray;}\${className} p ~ span{opacity:0.8;}\`;
`);
// tslint:enable
});

test(`compile simple media query`, async t => {
  const css = evalScript(t.context.simpleMediaQuery);
  t.is(css, `.y{color:red;}@media (max-width: 599px){.y{color:blue;}}`);
});

test(`compile complex media query`, async t => {
  const css = evalScript(t.context.complexMediaQuery);
  t.is(css, `.y{color:red;}@media (max-width: 599px){.y{color:blue;}.y .item{color:purple;}}`);
});

test(`compile keyframe`, async t => {
  const css = evalScript(t.context.keyframe);
  t.is(css, `@keyframe a{ 0%{color:red;} 100%{color:blue;}}`);
});

test(`compile style with dynamic properties and values`, async t => {
  const css = evalScript(`
  const proAndValue = 'color:red';
  const style = lyl \`{
    \${proAndValue}
    cursor: default
  }\`;
  style('.y');
  `);
  t.is(css, `.y{color:red;cursor:default;}`);
});

test(`commas and linefeed to separate selectors`, async t => {
  const css = evalScript(`
  const proAndValue = 'color:red';
  const style = lyl \`{
    .a,
    // test
    .b {
      color: blue
    }
  }\`;
  style('.y');
  `);
  t.is(css, `.y .a,.y .b{color:blue;}`);
});

test(`with comments`, async t => {
  const styleContent = `{
    // Color blue
    .a {
      color: blue
    }
  }`;
  const css = evalScript(`
  const style = lyl \`${styleContent}\`;
  style('.y');
  `);
  t.is(css, `.y .a{color:blue;}`);
  t.log(styleContent);
  t.is((className: string) => `${className} .a{color:blue;}`('.y'), `.y .a{color:blue;}`);
});
test(`media queries with inheritance style`, async t => {

  const colorBlue = (className: string) => `${className}{color:blue;}`;
  const colorBlueAll = (className: string) => `@media all{/* __READY__ */${st2c((colorBlue), `${className}`)}}`;

  const css1 = evalScript(`
  ${st2c}
  ${StyleCollection}
  const colorBlue = lyl \`{
    color: blue
  }\`;
  const style = lyl \`{
    @media all {
      ...\${colorBlue}
    }
  }\`;
  style('.y');
  `);

  const inStyle = (className: string) => `${className}{color:blue;}${className} sel{prop:value;}`;
  const styleContent = (className: string) => `@media all{${className}{prop:value;prop2:value2;}/* __READY__ */${st2c((inStyle), `${className}`)}${className}{prop3:value3;}}`;

  const css2 = evalScript(`
  ${st2c}
  ${StyleCollection}
  const inStyle = lyl \`{
    color: blue
    sel {
      prop: value
    }
  }\`;
  const style = lyl \`{
    @media all {
      prop: value
      prop2: value2
      ...\${inStyle}
      prop3: value3
    }
  }\`;
  style('.y');
  `);
  const expected1 = '@media all{.y{color:blue;}}';
  t.is(removeComments(colorBlueAll('.y')), expected1);
  t.is(removeComments(css1), expected1);
  const expected2 = '@media all{.y{prop:value;prop2:value2;}.y{color:blue;}.y sel{prop:value;}.y{prop3:value3;}}';
  t.is(removeComments(styleContent('.y')), expected2);
  t.is(removeComments(css2), expected2);
});

function evalScript(script: string) {
  // tslint:disable-next-line: no-eval
  return eval(tsNode.register({
    compilerOptions: {
      module: 'commonjs',
      sourceMap: false
    },
    transpileOnly: true
  }).compile(styleCompiler(script), 'file.ts'));
}

function removeComments(css: string) {
  return css.replace(/\/\*[^\/\*]+\*\//g, '');
}
