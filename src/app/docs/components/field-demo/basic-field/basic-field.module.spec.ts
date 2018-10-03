import { BasicFieldModule } from './basic-field.module';

describe('BasicFieldModule', () => {
  let basicFieldModule: BasicFieldModule;

  beforeEach(() => {
    basicFieldModule = new BasicFieldModule();
  });

  it('should create an instance', () => {
    expect(basicFieldModule).toBeTruthy();
  });
});
