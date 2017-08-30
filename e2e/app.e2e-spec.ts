import { ScrumolaPage } from './app.po';

describe('scrumola App', function() {
  let page: ScrumolaPage;

  beforeEach(() => {
    page = new ScrumolaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
