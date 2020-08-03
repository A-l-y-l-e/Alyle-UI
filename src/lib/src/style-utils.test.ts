import anyTest, { TestInterface } from 'ava';
import { eachMedia, MediaQueryArrayDeprecated, parseMediaQueriesFromString, parseMediaQueryFromString } from './style-utils';

const test = anyTest as TestInterface<Context>;

class Context { }

test.before(t => {
  t.context = new Context();
});

test('eachMedia: 1@Small', t => {
  const media = toMedia('1@Small');
  t.deepEqual(media, [[1, 'Small']]);
});

test('eachMedia: 1', t => {
  const media = toMedia('1');
  t.deepEqual(media, [[1, null]]);
});

test('eachMedia: 8 12@XSmall', t => {
  const media = toMedia('8 12@XSmall');
  t.deepEqual(media, [[8, null], [12, 'XSmall']]);
});

test('eachMedia: 8 12@XSmall@Small', t => {
  const media = toMedia('8 12@XSmall@Small');
  t.deepEqual(media, [[8, null], [12, 'XSmall'], [12, 'Small']]);
});

test('eachMedia: display:none display:block@Large@XLarge', t => {
  const value = 'display:none display:block@Large@XLarge';
  const media = toMedia(value);
  t.deepEqual(media, [
    ['display:none', null],
    ['display:block', 'Large'],
    ['display:block', 'XLarge']
  ]);
});

test(`eachMedia: []`, t => {
  const media = toMedia([]);
  t.deepEqual(media, []);
});

test(`eachMedia: [8, [12, '@XSmall@Small']]`, t => {
  const media = toMedia([8, [12, '@XSmall@Small']]);
  t.deepEqual(media, [[8, null], [12, 'XSmall'], [12, 'Small']]);
});

test(`eachMedia: ['color:blue']`, t => {
  const media = toMedia(['color:blue']);
  t.deepEqual(media, [['color:blue', null]]);
});



test('Inline Media Query: 1@Small', t => {
  const media = getInlineMediaQueries('1@Small');
  t.deepEqual(media, [[1, 'Small']]);
});

test('Inline Media Query: 1px@Small', t => {
  const media = getInlineMediaQueries('1px@Small');
  t.deepEqual(media, [['1px', 'Small']]);
});

test('Inline Media Query: 1', t => {
  const media = getInlineMediaQueries('1');
  t.deepEqual(media, [[1, null]]);
});

test('Inline Media Query: 8 12@XSmall', t => {
  const media = getInlineMediaQueries('8 12@XSmall');
  t.deepEqual(media, [[8, null], [12, 'XSmall']]);
});

test('Inline Media Query: 8 12@XSmall@Small', t => {
  const media = getInlineMediaQueries('8 12@XSmall@Small');
  t.deepEqual(media, [[8, null], [12, 'XSmall'], [12, 'Small']]);
});

test('Inline Media Query: display:none display:block@Large@XLarge', t => {
  const value = 'display:none display:block@Large@XLarge';
  const media = getInlineMediaQueries(value);
  t.deepEqual(media, [
    ['display:none', null],
    ['display:block', 'Large'],
    ['display:block', 'XLarge']
  ]);
});

test(`Inline Media Query: ['color:blue']`, t => {
  const media = parseMediaQueryFromString('color:blue');
  t.deepEqual(media, [['color:blue', null]]);
});

function getInlineMediaQueries(str: string) {
  const media: [string | number, string | null][] = Array.prototype.concat.apply([], parseMediaQueriesFromString(str).map(_ => parseMediaQueryFromString(_)));
  return media;
}

function toMedia(str: string | MediaQueryArrayDeprecated) {
  const arr: [string | number | (string | number)[], string | null][] = [];
  eachMedia(str, (val, media) => arr.push([val, media]));
  return arr;
}
