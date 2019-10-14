import {Dictionary} from 'lodash';

/** Maps to the different options for media previews in TweetDeck columns. */
export enum TweetDeckColumnMediaPreviewSizesEnum {
  OFF = 'off',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface TweetDeckObjectColumn {
  updateIndex: Dictionary<any>;
  detailViewComponent: {
    chirp: any;
    mainChirp: any;
    repliesTo: {
      repliesTo: any[];
    };
    replies: {
      replies: any[];
    };
  };
}

/**
 * Use this interface everytime you need to refer to the TD variable in a type-safe way
 * NOTE: this interface is not meant to be 100% accurate, it's only meant to reflect the few fields/APIs we exploit inside of the `TD` object.
 */
export interface TweetDeckObject {
  mustaches: Dictionary<string>;
  controller: {
    columnManager: {
      get(key: string): TweetDeckObjectColumn;
    };
  };
}
