import { SimpleListModule } from './simple-list.module';

describe('SimpleListModule', () => {
  let simpleListModule: SimpleListModule;

  beforeEach(() => {
    simpleListModule = new SimpleListModule();
  });

  it('should create an instance', () => {
    expect(simpleListModule).toBeTruthy();
  });
});
