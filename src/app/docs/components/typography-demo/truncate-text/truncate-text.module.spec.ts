import { TruncateTextModule } from './truncate-text.module';

describe('TruncateTextModule', () => {
  let truncateTextModule: TruncateTextModule;

  beforeEach(() => {
    truncateTextModule = new TruncateTextModule();
  });

  it('should create an instance', () => {
    expect(truncateTextModule).toBeTruthy();
  });
});
