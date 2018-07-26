import { TypographyDemoBasicModule } from './typography-demo-basic.module';

describe('TypographyDemoBasicModule', () => {
  let typographyDemoBasicModule: TypographyDemoBasicModule;

  beforeEach(() => {
    typographyDemoBasicModule = new TypographyDemoBasicModule();
  });

  it('should create an instance', () => {
    expect(typographyDemoBasicModule).toBeTruthy();
  });
});
