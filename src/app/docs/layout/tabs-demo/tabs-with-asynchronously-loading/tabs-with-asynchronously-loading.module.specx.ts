import { TabsWithAsynchronouslyLoadingModule } from './tabs-with-asynchronously-loading.module';

describe('TabsWithAsynchronouslyLoadingModule', () => {
  let tabsWithAsynchronouslyLoadingModule: TabsWithAsynchronouslyLoadingModule;

  beforeEach(() => {
    tabsWithAsynchronouslyLoadingModule = new TabsWithAsynchronouslyLoadingModule();
  });

  it('should create an instance', () => {
    expect(tabsWithAsynchronouslyLoadingModule).toBeTruthy();
  });
});
