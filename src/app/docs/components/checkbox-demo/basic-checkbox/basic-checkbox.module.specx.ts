import { BasicCheckboxModule } from './basic-checkbox.module';

describe('BasicCheckboxModule', () => {
  let basicCheckboxModule: BasicCheckboxModule;

  beforeEach(() => {
    basicCheckboxModule = new BasicCheckboxModule();
  });

  it('should create an instance', () => {
    expect(basicCheckboxModule).toBeTruthy();
  });
});
