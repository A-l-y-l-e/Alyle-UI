import { FieldPlaygroundModule } from './field-playground.module';

describe('FieldPlaygroundModule', () => {
  let fieldPlaygroundModule: FieldPlaygroundModule;

  beforeEach(() => {
    fieldPlaygroundModule = new FieldPlaygroundModule();
  });

  it('should create an instance', () => {
    expect(fieldPlaygroundModule).toBeTruthy();
  });
});
