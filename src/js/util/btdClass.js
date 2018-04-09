export class BTDComponent {
  constructor(settings) {
    if (!settings) {
      throw new Error('Please pass Better TweetDeck\'s settings to the constructor');
    }

    this.settings = settings;
  }
}
