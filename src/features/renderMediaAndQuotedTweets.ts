import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const renderMediaAndQuotedTweets = makeBTDModule(({TD}) => {
  const OGPluck = TD.util.pluck;
  const OGCanSend = OGPluck('canSend');
  const customCanSend = (t: any) => {
    if (t.hasQuotedTweet && t.hasMediaAttached) {
      return true;
    }

    return OGCanSend(t);
  };
  TD.util.pluck = (e) => {
    if (e === 'canSend') {
      return customCanSend;
    }

    return OGPluck(e);
  };

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string
      .replace('{{^hasMedia}}', '')
      .replace('{{/hasMedia}}', '')
      .replace(`{{>status/tweet_media_wrapper}}`, '')
      .replace(
        `<div class="js-card-container"></div>  {{#quotedTweet}}`,
        `{{>status/tweet_media_wrapper}}  {{#quotedTweet}}`
      );
  });

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (string) => {
    return string.replace('{{^hasMedia}}', '').replace('{{/hasMedia}}', '');
  });
});
