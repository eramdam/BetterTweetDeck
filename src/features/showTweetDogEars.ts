import './showTweetDogEars.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const showTweetDogEars = makeBTDModule(({settings, TD}) => {
  if (!settings.showLikeRTDogears) {
    return;
  }

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (markup) => {
    return markup.replace(
      '</footer> {{/getMainTweet}}',
      '</footer> {{/getMainTweet}} <i class="sprite tweet-dogear"></i>'
    );
  });
  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (markup) => {
    return markup.replace(
      '{{>status/tweet_single_footer}} ',
      '{{>status/tweet_single_footer}} <i class="sprite tweet-dogear"></i>'
    );
  });
});
