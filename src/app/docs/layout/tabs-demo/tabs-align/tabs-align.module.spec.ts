import { TabsAlignModule } from './tabs-align.module';

describe('TabsAlignModule', () => {
  let tabsAlignModule: TabsAlignModule;

  beforeEach(() => {
    tabsAlignModule = new TabsAlignModule();
  });

  it('should create an instance', () => {
    expect(tabsAlignModule).toBeTruthy();
  });
});
