import { CardDemoBasicModule } from './card-demo-basic.module';

describe('CardDemoBasicModule', () => {
  let cardDemoBasicModule: CardDemoBasicModule;

  beforeEach(() => {
    cardDemoBasicModule = new CardDemoBasicModule();
  });

  it('should create an instance', () => {
    expect(cardDemoBasicModule).toBeTruthy();
  });
});
