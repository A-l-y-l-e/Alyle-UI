import { BasicRadioModule } from './basic-radio.module';

describe('BasicRadioModule', () => {
  let basicRadioModule: BasicRadioModule;

  beforeEach(() => {
    basicRadioModule = new BasicRadioModule();
  });

  it('should create an instance', () => {
    expect(basicRadioModule).toBeTruthy();
  });
});
