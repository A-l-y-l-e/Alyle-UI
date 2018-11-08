import { ComplexCheckboxModule } from './complex-checkbox.module';

describe('ComplexCheckboxModule', () => {
  let complexCheckboxModule: ComplexCheckboxModule;

  beforeEach(() => {
    complexCheckboxModule = new ComplexCheckboxModule();
  });

  it('should create an instance', () => {
    expect(complexCheckboxModule).toBeTruthy();
  });
});
