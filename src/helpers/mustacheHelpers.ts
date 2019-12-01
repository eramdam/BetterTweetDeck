import {TweetDeckObject} from '../types/tweetdeckTypes';

type MustacheTransformer = (mustacheString: string) => string;

/** Modifies a mustache template in TD.mustaches in place if it exists */
export function modifyMustacheTemplate(
  TweetDeck: TweetDeckObject,
  targetMustache: string,
  transformer: MustacheTransformer
) {
  if (!TweetDeck.mustaches[targetMustache]) {
    return;
  }

  TweetDeck.mustaches[targetMustache] = transformer(TweetDeck.mustaches[targetMustache]);
}
