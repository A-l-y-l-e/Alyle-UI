import { BasicUsesAvatarModule } from './basic-uses-avatar.module';

describe('BasicUsesAvatarModule', () => {
  let basicUsesAvatarModule: BasicUsesAvatarModule;

  beforeEach(() => {
    basicUsesAvatarModule = new BasicUsesAvatarModule();
  });

  it('should create an instance', () => {
    expect(basicUsesAvatarModule).toBeTruthy();
  });
});
