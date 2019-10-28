import anyTest, { TestInterface } from 'ava';
import { hasLylStyle, styleCompiler } from './compiler';

const test = anyTest as TestInterface<Context>;

class Context {
  style = `lyl \`{
    color: red
  }\``;

  fnThatReturnsStyleAStyle = `() => lyl \`{
    color: blue
  }\``;

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
}


test.before(t => {
  t.context = new Context();
});

test('should contain a lyl style', t => {
  t.true(hasLylStyle(t.context.style));
  t.true(hasLylStyle(t.context.fnThatReturnsStyleAStyle));
});

test(`should be equal to .y{color: red;}`, t => {
  const script = styleCompiler(t.context.style);
  // tslint:disable-next-line: no-eval
  t.is(`.y{color: red;}`, eval(script)('.y'));
});

test(`a StyleFn should be equal to .y {color: blue;}`, t => {
  const script = styleCompiler(t.context.fnThatReturnsStyleAStyle);
  // tslint:disable-next-line: no-eval
  t.is(`.y{color: blue;}`, eval(script)('.y'));
});

test(`compile style that contains an expression`, t => {
  const script = styleCompiler(t.context.styleWithExpressions);
  // tslint:disable-next-line: no-eval
  t.is(`.y{top: 0;left: 41px;right: 2px;}`, eval(script));
});


