import { GraphIntPage } from './app.po';

describe('graph-int App', () => {
  let page: GraphIntPage;

  beforeEach(() => {
    page = new GraphIntPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
