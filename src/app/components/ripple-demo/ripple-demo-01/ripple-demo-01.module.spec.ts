import { RippleDemo01Module } from './ripple-demo-01.module';

describe('RippleDemo01Module', () => {
  let rippleDemo01Module: RippleDemo01Module;

  beforeEach(() => {
    rippleDemo01Module = new RippleDemo01Module();
  });

  it('should create an instance', () => {
    expect(rippleDemo01Module).toBeTruthy();
  });
});
