import { TabsPlacementModule } from './tabs-placement.module';

describe('TabsPlacementModule', () => {
  let tabsPlacementModule: TabsPlacementModule;

  beforeEach(() => {
    tabsPlacementModule = new TabsPlacementModule();
  });

  it('should create an instance', () => {
    expect(tabsPlacementModule).toBeTruthy();
  });
});
