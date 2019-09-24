import {Dictionary} from 'lodash';

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

export interface TweetDeckObject {
  mustaches: Dictionary<string>;
  controller: {
    columnManager: {
      get(key: string): TweetDeckObjectColumn;
    };
  };
}
