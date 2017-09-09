import { IconButtonDemoModule } from './icon-button-demo.module';

describe('IconButtonDemoModule', () => {
  let iconButtonDemoModule: IconButtonDemoModule;

  beforeEach(() => {
    iconButtonDemoModule = new IconButtonDemoModule();
  });

  it('should create an instance', () => {
    expect(iconButtonDemoModule).toBeTruthy();
  });
});
