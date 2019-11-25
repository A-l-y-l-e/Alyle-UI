import anyTest, { TestInterface } from 'ava';
import { StyleCollection, lyl, mergeThemes } from './parse';

const test = anyTest as TestInterface<Context>;

class Context { }

test.before(t => {
  t.context = new Context();
});

test('merge theme StyleCollection with StyleTemplate', t => {
  const themeA = {
    a: new StyleCollection(),
    b: new StyleCollection(lyl `{
      color: red
    }`)
  };
  const themeB = {
    a: lyl `{
      color: red
    }`,
    b: lyl `{
      background-color: #000000
    }`
  };

  const themeC = {
    b: new StyleCollection(lyl `{
      color: #000
    }`),
  };

  const themeD = {
    b: lyl `{
      background: #fff
    }`,
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
