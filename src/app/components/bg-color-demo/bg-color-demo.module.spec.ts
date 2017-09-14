import { BgColorDemoModule } from './bg-color-demo.module';

describe('BgColorDemoModule', () => {
  let bgColorDemoModule: BgColorDemoModule;

  beforeEach(() => {
    bgColorDemoModule = new BgColorDemoModule();
  });

  it('should create an instance', () => {
    expect(bgColorDemoModule).toBeTruthy();
  });
});
