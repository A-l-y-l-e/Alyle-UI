import { InsetDividersModule } from './inset-dividers.module';

describe('InsetDividersModule', () => {
  let insetDividersModule: InsetDividersModule;

  beforeEach(() => {
    insetDividersModule = new InsetDividersModule();
  });

  it('should create an instance', () => {
    expect(insetDividersModule).toBeTruthy();
  });
});
