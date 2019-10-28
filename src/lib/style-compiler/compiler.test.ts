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
  const item = lyl\`{
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


function evalScript(script: string) {
  // tslint:disable-next-line: no-eval
  return eval(tsNode.register({
    compilerOptions: {
      module: 'commonjs',
      sourceMap: false
    }
  }).compile(styleCompiler(script), 'file.ts'));
}
