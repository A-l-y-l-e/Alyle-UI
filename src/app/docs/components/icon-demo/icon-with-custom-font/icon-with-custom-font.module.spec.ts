import { IconWithCustomFontModule } from './icon-with-custom-font.module';

describe('IconWithCustomFontModule', () => {
  let iconWithCustomFontModule: IconWithCustomFontModule;

  beforeEach(() => {
    iconWithCustomFontModule = new IconWithCustomFontModule();
  });

  it('should create an instance', () => {
    expect(iconWithCustomFontModule).toBeTruthy();
  });
});
