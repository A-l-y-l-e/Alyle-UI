import { GridDemoModule } from './grid-demo.module';

describe('GridDemoModule', () => {
  let gridDemoModule: GridDemoModule;

  beforeEach(() => {
    gridDemoModule = new GridDemoModule();
  });

  it('should create an instance', () => {
    expect(gridDemoModule).toBeTruthy();
  });
});
