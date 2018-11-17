import { BasicSnackBarModule } from './basic-snack-bar.module';

describe('BasicSnackBarModule', () => {
  let basicSnackBarModule: BasicSnackBarModule;

  beforeEach(() => {
    basicSnackBarModule = new BasicSnackBarModule();
  });

  it('should create an instance', () => {
    expect(basicSnackBarModule).toBeTruthy();
  });
});
