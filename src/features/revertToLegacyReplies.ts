import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

/** Reverts the tweet display to show @mentions inline. */
export const maybeRevertToLegacyReplies = makeBTDModule(({TD, settings}) => {
  if (!settings.showLegacyReplies) {
    return;
  }

  TD.services.TwitterStatus.prototype.getOGContext = function getOGContext() {
    const repliers = this.getReplyingToUsers() || [];
    const replyingToThemselves = this.user.screenName === this.inReplyToScreenName;

    if (repliers.length === 0 || (replyingToThemselves && repliers.length === 1)) {
      return '';
    }

    const filtered = repliers
      .filter((user) => {
        // When user are replying to themselves are replying to ppl as well (them + other ppl)
        if (replyingToThemselves && repliers.length > 1) {
          return user.screenName !== this.user.screenName;
        }

        return true;
      })
      .filter((user) => {
        const str = `<a href="https://twitter.com/${user.screenName}/"`;

        return this.htmlText.indexOf(str) !== 0;
      });

    return filtered
      .map((user) => TD.ui.template.render('text/profile_link', {user}))
      .concat('')
      .join(' ');
  };

  require('./revertToLegacyReplies.css');

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (template) =>
    template.replace(
      'lang="{{lang}}">{{{htmlText}}}</p>',
      'lang="{{lang}}">{{#getMainTweet}}{{{getOGContext}}}{{/getMainTweet}}{{{htmlText}}}</p>'
    )
  );
  // In detailed tweets
  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (template) =>
    template.replace(
      'lang="{{lang}}">{{{htmlText}}}</p>',
      'lang="{{lang}}">{{#getMainTweet}}{{{getOGContext}}}{{/getMainTweet}}{{{htmlText}}}</p>'
    )
  );
  // In quote tweets
  modifyMustacheTemplate(TD, 'status/quoted_tweet.mustache', (template) =>
    template.replace(
      'with-linebreaks">{{{htmlText}}}',
      'with-linebreaks">{{#getMainTweet}}{{{getOGContext}}}{{/getMainTweet}}{{{htmlText}}}'
    )
  );

  modifyMustacheTemplate(TD, 'status/quoted_tweet.mustache', (template) =>
    template.replace(
      'with-linebreaks">{{{htmlText}}}',
      'with-linebreaks">{{#getMainTweet}}{{{getOGContext}}}{{/getMainTweet}}{{{htmlText}}}'
    )
  );

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (template) =>
    template.replace(
      'lang="{{lang}}">{{{htmlText}}}</p>',
      'lang="{{lang}}">{{#getMainTweet}}{{{getOGContext}}}{{/getMainTweet}}{{{htmlText}}}</p>'
    )
  );
});
