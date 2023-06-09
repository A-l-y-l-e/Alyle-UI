import { LyThemeModule } from './theme.module';

describe('LyThemeModule', () => {
  let themeModule: LyThemeModule;

  beforeEach(() => {
    themeModule = new LyThemeModule();
  });

  it('should create an instance', () => {
    expect(themeModule).toBeTruthy();
  });
});
