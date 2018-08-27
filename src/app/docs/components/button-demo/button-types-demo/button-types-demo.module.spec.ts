import { ButtonTypesDemoModule } from './button-types-demo.module';

describe('ButtonTypesDemoModule', () => {
  let buttonTypesDemoModule: ButtonTypesDemoModule;

  beforeEach(() => {
    buttonTypesDemoModule = new ButtonTypesDemoModule();
  });

  it('should create an instance', () => {
    expect(buttonTypesDemoModule).toBeTruthy();
  });
});
