import { PaperWithColorModule } from './paper-with-color.module';

describe('PaperWithColorModule', () => {
  let paperWithColorModule: PaperWithColorModule;

  beforeEach(() => {
    paperWithColorModule = new PaperWithColorModule();
  });

  it('should create an instance', () => {
    expect(paperWithColorModule).toBeTruthy();
  });
});
