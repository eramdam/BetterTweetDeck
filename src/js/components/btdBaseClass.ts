import {BTDSettings} from '../types';

export abstract class BTDComponent {
  settings: BTDSettings;
  TD: any;

  constructor(settings: any, TDObject: any) {
    if (new.target === BTDComponent) {
      throw new Error('BTDComponent cannot be instanciated directly, create a class that extends it.');
    }

    if (!settings) {
      throw new Error("Please pass Better TweetDeck's settings to the constructor");
    }

    if (!TDObject) {
      throw new Error('Please pass the TD global in the constructor');
    }

    this.settings = settings;
    this.TD = TDObject;
  }
}
