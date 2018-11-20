import { BasicPaperModule } from './basic-paper.module';

describe('BasicPaperModule', () => {
  let basicPaperModule: BasicPaperModule;

  beforeEach(() => {
    basicPaperModule = new BasicPaperModule();
  });

  it('should create an instance', () => {
    expect(basicPaperModule).toBeTruthy();
  });
});
