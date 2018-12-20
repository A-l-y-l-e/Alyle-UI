import { ListDividersModule } from './list-dividers.module';

describe('ListDividersModule', () => {
  let listDividersModule: ListDividersModule;

  beforeEach(() => {
    listDividersModule = new ListDividersModule();
  });

  it('should create an instance', () => {
    expect(listDividersModule).toBeTruthy();
  });
});
