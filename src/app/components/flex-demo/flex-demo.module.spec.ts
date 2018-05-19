import { FlexDemoModule } from './flex-demo.module';

describe('FlexDemoModule', () => {
  let flexDemoModule: FlexDemoModule;

  beforeEach(() => {
    flexDemoModule = new FlexDemoModule();
  });

  it('should create an instance', () => {
    expect(flexDemoModule).toBeTruthy();
  });
});
