import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createTestApp } from '@alyle/ui/schematics/testing';
import * as path from 'path';

import anyTest, { TestInterface } from 'ava';
import { Schema } from './schema';

const test = anyTest as TestInterface<Context>;

const collectionPath = path.join(__dirname, '../collection.json');


class Context {
  runner = new SchematicTestRunner('schematics', collectionPath);
  appTree: Tree;

  static async init() {
    const context = new Context();
    // Do async stuff
    await context.build();
    // Return instance
    return context;
  }

  async build() {
    this.appTree = await createTestApp(this.runner);
  }
}

test.beforeEach(async t => {
  t.context = await Context.init();
});


test(`should update package.json from CLI ng-add command`, async t => {
  const { appTree, runner } = t.context;
  const tree = await runner.runSchematicAsync('ng-add', { }, appTree).toPromise();
  const packageJson = JSON.parse(tree.readContent('/package.json'));
  const dependencies = packageJson.dependencies;

  t.truthy(dependencies[`@alyle/ui`]);
  t.truthy(dependencies[`@angular/cdk`]);
  t.truthy(dependencies[`hammerjs`]);
});

test(`ng-add-setup-project with default options`, async t => {
  const { appTree, runner } = t.context;
  const tree = await runner.runSchematicAsync('ng-add-setup-project', { }, appTree).toPromise();
  const appModule = tree.readContent('/projects/Alyle/src/app/app.module.ts');
  const appComponent = tree.readContent('/projects/Alyle/src/app/app.component.ts');
  const main = tree.readContent('/projects/Alyle/src/main.ts');

  t.is(appModule.match(/BrowserAnimationsModule/g)?.length, 2);
  t.is(appModule.match(/HammerModule/g)?.length, 2);
  t.is(appModule.match(/MinimaLight/g)?.length, 2);
  t.is(appModule.match(/LY_THEME/g)?.length, 4);
  t.is(appModule.match(/LY_THEME_NAME/g)?.length, 2);

  t.is(appComponent.match(/StyleRenderer/g)?.length, 3);
  t.true(appComponent.includes('readonly sRenderer: StyleRenderer'));
  t.true(appComponent.includes('readonly classes = this.sRenderer.renderSheet(STYLES, true)'));
  t.true(appModule.includes(`{ provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }`));

  t.true(main.includes(`import 'hammerjs';`));
  t.log(tree.readContent('/projects/Alyle/src/app/app.module.ts'));
});

test(`ng-add-setup-project with two themes`, async t => {
  const { appTree, runner } = t.context;
  const tree = await runner.runSchematicAsync('ng-add-setup-project', {
    themes: ['minima-light', 'minima-deep-dark']
  } as Schema, appTree).toPromise();

  const appModule = tree.readContent('/projects/Alyle/src/app/app.module.ts');
  t.is(appModule.match(/MinimaLight/g)?.length, 2);
  t.is(appModule.match(/MinimaDeepDark/g)?.length, 2);
});

test(`ng-add-setup-project without gestures`, async t => {
  const { appTree, runner } = t.context;
  const tree = await runner.runSchematicAsync('ng-add-setup-project', {
    gestures: false
  } as Schema, appTree).toPromise();

  const appModule = tree.readContent('/projects/Alyle/src/app/app.module.ts');
  const main = tree.readContent('/projects/Alyle/src/app/app.module.ts');

  t.false(main.includes(`import 'hammerjs';`));
  t.false(appModule.includes(`{ provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }`));
});

