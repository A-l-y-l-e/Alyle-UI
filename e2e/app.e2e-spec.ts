import { AlyleUIDemoPage } from './app.po';

describe('alyle-ui-demo App', () => {
  let page: AlyleUIDemoPage;

  beforeEach(() => {
    page = new AlyleUIDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
