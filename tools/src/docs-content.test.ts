import anyTest, { TestInterface } from 'ava';
import { getPackageNameFromPath } from './docs-content';

const test = anyTest as TestInterface<Context>;

class Context { }

test.before(t => {
  t.context = new Context();
});

test(`It should get the package name from a path`, t => {
  t.is(getPackageNameFromPath(`\"src/lib/avatar/avatar\"`), `@alyle/ui/avatar`);
  t.is(getPackageNameFromPath(`\"src/lib/src/common/color.ts\"`), `@alyle/ui`);
});
