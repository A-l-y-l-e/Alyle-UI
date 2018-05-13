import { IconModule } from './icon.module';

describe('IconModule', () => {
  let iconModule: IconModule;

  beforeEach(() => {
    iconModule = new IconModule();
  });

  it('should create an instance', () => {
    expect(iconModule).toBeTruthy();
  });
});
