import { ToolbarWithIconsModule } from './toolbar-with-icons.module';

describe('ToolbarWithIconsModule', () => {
  let toolbarWithIconsModule: ToolbarWithIconsModule;

  beforeEach(() => {
    toolbarWithIconsModule = new ToolbarWithIconsModule();
  });

  it('should create an instance', () => {
    expect(toolbarWithIconsModule).toBeTruthy();
  });
});
