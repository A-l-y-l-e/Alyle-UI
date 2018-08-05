import { BasicTabsModule } from './basic-tabs.module';

describe('BasicTabsModule', () => {
  let basicTabsModule: BasicTabsModule;

  beforeEach(() => {
    basicTabsModule = new BasicTabsModule();
  });

  it('should create an instance', () => {
    expect(basicTabsModule).toBeTruthy();
  });
});
