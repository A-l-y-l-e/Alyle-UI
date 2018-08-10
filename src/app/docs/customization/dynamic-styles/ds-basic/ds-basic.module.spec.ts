import { DsBasicModule } from './ds-basic.module';

describe('DsBasicModule', () => {
  let dsBasicModule: DsBasicModule;

  beforeEach(() => {
    dsBasicModule = new DsBasicModule();
  });

  it('should create an instance', () => {
    expect(dsBasicModule).toBeTruthy();
  });
});
