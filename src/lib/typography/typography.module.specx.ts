import { TypographyModule } from './typography.module';

describe('TypographyModule', () => {
  let typographyModule: TypographyModule;

  beforeEach(() => {
    typographyModule = new TypographyModule();
  });

  it('should create an instance', () => {
    expect(typographyModule).toBeTruthy();
  });
});
