import { PackageStatusModule } from './package-status.module';

describe('PackageStatusModule', () => {
  let packageStatusModule: PackageStatusModule;

  beforeEach(() => {
    packageStatusModule = new PackageStatusModule();
  });

  it('should create an instance', () => {
    expect(packageStatusModule).toBeTruthy();
  });
});
