import { ToolbarBasicDemoModule } from './toolbar-basic-demo.module';

describe('ToolbarBasicDemoModule', () => {
  let toolbarBasicDemoModule: ToolbarBasicDemoModule;

  beforeEach(() => {
    toolbarBasicDemoModule = new ToolbarBasicDemoModule();
  });

  it('should create an instance', () => {
    expect(toolbarBasicDemoModule).toBeTruthy();
  });
});
