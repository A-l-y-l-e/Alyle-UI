import { FlexDemoOneModule } from './flex-demo-one.module';

describe('FlexDemoOneModule', () => {
  let flexDemoOneModule: FlexDemoOneModule;

  beforeEach(() => {
    flexDemoOneModule = new FlexDemoOneModule();
  });

  it('should create an instance', () => {
    expect(flexDemoOneModule).toBeTruthy();
  });
});
