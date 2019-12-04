import anyTest, { TestInterface } from 'ava';
import { eachMedia } from './style-utils';

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


function toMedia(str: string) {
  const arr: [string | number | (string | number)[], string | null][] = [];
  eachMedia(str, (val, media) => arr.push([val, media]));
  return arr;
}
