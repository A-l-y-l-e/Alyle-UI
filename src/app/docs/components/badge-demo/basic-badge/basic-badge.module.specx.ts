import { BasicBadgeModule } from './basic-badge.module';

describe('BasicBadgeModule', () => {
  let basicBadgeModule: BasicBadgeModule;

  beforeEach(() => {
    basicBadgeModule = new BasicBadgeModule();
  });

  it('should create an instance', () => {
    expect(basicBadgeModule).toBeTruthy();
  });
});
