import { BasicTabsModule } from '@docs/layout/tabs-demo/basic-tabs/basic-tabs.module';

describe('BasicTabsModule', () => {
  let basicTabsModule: BasicTabsModule;

  beforeEach(() => {
    basicTabsModule = new BasicTabsModule();
  });

  it('should create an instance', () => {
    expect(basicTabsModule).toBeTruthy();
  });
});
