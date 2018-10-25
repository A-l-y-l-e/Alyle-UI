import { ResponsiveWithDsModule } from './responsive-with-ds.module';

describe('ResponsiveWithDsModule', () => {
  let responsiveWithDsModule: ResponsiveWithDsModule;

  beforeEach(() => {
    responsiveWithDsModule = new ResponsiveWithDsModule();
  });

  it('should create an instance', () => {
    expect(responsiveWithDsModule).toBeTruthy();
  });
});
