import { GridDemoResponsiveModule } from './grid-demo-responsive.module';

describe('GridDemoResponsiveModule', () => {
  let gridDemoResponsiveModule: GridDemoResponsiveModule;

  beforeEach(() => {
    gridDemoResponsiveModule = new GridDemoResponsiveModule();
  });

  it('should create an instance', () => {
    expect(gridDemoResponsiveModule).toBeTruthy();
  });
});
