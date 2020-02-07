import anyTest, { TestInterface } from 'ava';
import {
  StyleCollection } from './parse';
import { mergeThemes } from './style-utils';

const test = anyTest as TestInterface<Context>;

class Context { }

test.before(t => {
  t.context = new Context();
});

test('merge theme StyleCollection with StyleTemplate', t => {
  const themeA = {
    a: new StyleCollection(),
    b: new StyleCollection((className: string) => `${className}{color:red;}`)
  };
  const themeB = {
    a: (className: string) => `${className}{color:red;}`,
    b: (className: string) => `${className}{background-color:#000000;}`
  };

  const themeC = {
    b: new StyleCollection((className: string) => `${className}{color:#000;}`),
  };

  const themeD = {
    b: (className: string) => `${className}{background:#fff;}`,
  };

  mergeThemes(themeA, themeB);

  t.is(
    themeA.a.css('.y'),
    '.y{color:red;}'
  );
  t.is(
    themeA.b.css('.y'),
    '.y{color:red;}.y{background-color:#000000;}'
  );
  t.is(
    mergeThemes({}, themeA, themeB, themeC, themeD).b.css('.y'),
    '.y{color:#000;}.y{background:#fff;}'
  );
  t.true(mergeThemes({}, themeA, themeB, themeC, themeD).b instanceof StyleCollection);
  t.true(mergeThemes({}, themeA, themeB, themeC, themeD).a instanceof StyleCollection);
});
