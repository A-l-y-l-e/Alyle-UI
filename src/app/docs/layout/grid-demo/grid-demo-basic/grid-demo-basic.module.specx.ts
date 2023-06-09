import { GridDemoBasicModule } from './grid-demo-basic.module';

describe('GridDemoBasicModule', () => {
  let gridDemoBasicModule: GridDemoBasicModule;

  beforeEach(() => {
    gridDemoBasicModule = new GridDemoBasicModule();
  });

  it('should create an instance', () => {
    expect(gridDemoBasicModule).toBeTruthy();
  });
});
