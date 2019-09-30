export const maybeRevertToLegacyReplies = (TD: any) => {
  TD.services.TwitterStatus.prototype.getOGContext = function getOGContext() {
    const repliers = this.getReplyingToUsers() || [];
    const replyingToThemselves = this.user.screenName === this.inReplyToScreenName;

    if (repliers.length === 0 || (replyingToThemselves && repliers.length === 1)) {
      return '';
    }

    const filtered = repliers
      .filter((user: any) => {
        // When user are replying to themselves are replying to ppl as well (them + other ppl)
        if (replyingToThemselves && repliers.length > 1) {
          return user.screenName !== this.user.screenName;
        }

        return true;
      })
      .filter((user: any) => {
        const str = `<a href="https://twitter.com/${user.screenName}/"`;

        return this.htmlText.indexOf(str) !== 0;
      });

    return filtered
      .map((user: any) => TD.ui.template.render('text/profile_link', {user}))
      .concat('')
      .join(' ');
  };
};
