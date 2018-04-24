import { ChildThemeModule } from './child-theme.module';

describe('ChildThemeModule', () => {
  let childThemeModule: ChildThemeModule;

  beforeEach(() => {
    childThemeModule = new ChildThemeModule();
  });

  it('should create an instance', () => {
    expect(childThemeModule).toBeTruthy();
  });
});
