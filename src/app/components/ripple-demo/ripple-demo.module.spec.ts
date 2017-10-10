import { RippleDemoModule } from './ripple-demo.module';

describe('RippleDemoModule', () => {
  let rippleDemoModule: RippleDemoModule;

  beforeEach(() => {
    rippleDemoModule = new RippleDemoModule();
  });

  it('should create an instance', () => {
    expect(rippleDemoModule).toBeTruthy();
  });
});
