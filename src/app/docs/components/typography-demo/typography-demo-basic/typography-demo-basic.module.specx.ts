import { TypographyDemoBasicModule } from '@docs/components/typography-demo/typography-demo-basic/typography-demo-basic.module';

describe('TypographyDemoBasicModule', () => {
  let typographyDemoBasicModule: TypographyDemoBasicModule;

  beforeEach(() => {
    typographyDemoBasicModule = new TypographyDemoBasicModule();
  });

  it('should create an instance', () => {
    expect(typographyDemoBasicModule).toBeTruthy();
  });
});
