import { BasicTooltipModule } from './basic-tooltip.module';

describe('BasicTooltipModule', () => {
  let basicTooltipModule: BasicTooltipModule;

  beforeEach(() => {
    basicTooltipModule = new BasicTooltipModule();
  });

  it('should create an instance', () => {
    expect(basicTooltipModule).toBeTruthy();
  });
});
