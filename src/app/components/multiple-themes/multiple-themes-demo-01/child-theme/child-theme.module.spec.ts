import { ChildLyCommonModule } from './child-theme.module';

describe('ChildLyCommonModule', () => {
  let childLyCommonModule: ChildLyCommonModule;

  beforeEach(() => {
    childLyCommonModule = new ChildLyCommonModule();
  });

  it('should create an instance', () => {
    expect(childLyCommonModule).toBeTruthy();
  });
});
