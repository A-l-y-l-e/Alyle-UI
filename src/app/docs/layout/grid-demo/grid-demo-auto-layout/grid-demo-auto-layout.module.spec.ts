import { GridDemoAutoLayoutModule } from './grid-demo-auto-layout.module';

describe('GridDemoAutoLayoutModule', () => {
  let gridDemoAutoLayoutModule: GridDemoAutoLayoutModule;

  beforeEach(() => {
    gridDemoAutoLayoutModule = new GridDemoAutoLayoutModule();
  });

  it('should create an instance', () => {
    expect(gridDemoAutoLayoutModule).toBeTruthy();
  });
});
