import { TabsWithIconModule } from './tabs-with-icon.module';

describe('TabsWithIconModule', () => {
  let tabsWithIconModule: TabsWithIconModule;

  beforeEach(() => {
    tabsWithIconModule = new TabsWithIconModule();
  });

  it('should create an instance', () => {
    expect(tabsWithIconModule).toBeTruthy();
  });
});
