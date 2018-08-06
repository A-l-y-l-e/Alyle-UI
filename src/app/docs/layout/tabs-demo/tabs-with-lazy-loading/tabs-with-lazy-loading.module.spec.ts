import { TabsWithLazyLoadingModule } from './tabs-with-lazy-loading.module';

describe('TabsWithLazyLoadingModule', () => {
  let tabsWithLazyLoadingModule: TabsWithLazyLoadingModule;

  beforeEach(() => {
    tabsWithLazyLoadingModule = new TabsWithLazyLoadingModule();
  });

  it('should create an instance', () => {
    expect(tabsWithLazyLoadingModule).toBeTruthy();
  });
});
