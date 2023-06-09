import { WithThemeVariablesModule } from './with-theme-variables.module';

describe('WithThemeVariablesModule', () => {
  let dsBasicModule: WithThemeVariablesModule;

  beforeEach(() => {
    dsBasicModule = new WithThemeVariablesModule();
  });

  it('should create an instance', () => {
    expect(dsBasicModule).toBeTruthy();
  });
});
