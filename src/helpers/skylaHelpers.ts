import {isTweetEntity, isUserEntity, Skyla, TweetDeckEntitiesType} from 'skyla';

export function getCompleteTweetById(skyla: Skyla, id: string) {
  const mainTweet = skyla.getTweetById(id);

  if (!isTweetEntity(mainTweet)) {
    return undefined;
  }

  const maybeMainUser = skyla.getEntityById(mainTweet.user, TweetDeckEntitiesType.USER);
  const mainUser = (isUserEntity(maybeMainUser) && maybeMainUser) || undefined;
  const maybeQuotedTweet =
    (mainTweet.quoted_status && skyla.getTweetById(mainTweet.quoted_status)) || undefined;
  const maybRetweetedTweet =
    (mainTweet.retweeted_status && skyla.getTweetById(mainTweet.retweeted_status)) || undefined;
  const quotedTweet = (isTweetEntity(maybeQuotedTweet) && maybeQuotedTweet) || undefined;
  const retweetedTweet = (isTweetEntity(maybRetweetedTweet) && maybRetweetedTweet) || undefined;

  const maybeQuotedUser =
    (quotedTweet?.user && skyla.getEntityById(quotedTweet?.user, TweetDeckEntitiesType.USER)) ||
    undefined;
  const quotedUser = (isUserEntity(maybeQuotedUser) && maybeQuotedUser) || undefined;

  const maybeRetweetedUser =
    (retweetedTweet?.user &&
      skyla.getEntityById(retweetedTweet?.user, TweetDeckEntitiesType.USER)) ||
    undefined;
  const retweetedUser = (isUserEntity(maybeRetweetedUser) && maybeRetweetedUser) || undefined;

  return {
    tweet: mainTweet,
    user: mainUser,
    quotedTweet,
    retweetedTweet,
    quotedUser,
    retweetedUser,
  };
}
