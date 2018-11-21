import { IconsModule } from './icons.module';

describe('IconsModule', () => {
  let iconsModule: IconsModule;

  beforeEach(() => {
    iconsModule = new IconsModule();
  });

  it('should create an instance', () => {
    expect(iconsModule).toBeTruthy();
  });
});
