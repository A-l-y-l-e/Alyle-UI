import { BgColorDemo01Module } from './bg-color-demo-01.module';

describe('BgColorDemo01Module', () => {
  let bgColorDemo01Module: BgColorDemo01Module;

  beforeEach(() => {
    bgColorDemo01Module = new BgColorDemo01Module();
  });

  it('should create an instance', () => {
    expect(bgColorDemo01Module).toBeTruthy();
  });
});
