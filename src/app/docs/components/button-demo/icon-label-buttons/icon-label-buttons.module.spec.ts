import { IconLabelButtonsModule } from './icon-label-buttons.module';

describe('IconLabelButtonsModule', () => {
  let iconLabelButtonsModule: IconLabelButtonsModule;

  beforeEach(() => {
    iconLabelButtonsModule = new IconLabelButtonsModule();
  });

  it('should create an instance', () => {
    expect(iconLabelButtonsModule).toBeTruthy();
  });
});
