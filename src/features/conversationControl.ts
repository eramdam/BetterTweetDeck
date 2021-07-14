import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export enum TwitterConversationModes {
  MENTION = 'ByInvitation',
  FOLLOW = 'Community',
  EVERYONE = '',
}

export const conversationControl = makeBTDModule(({TD, jq, mR}) => {
  const featureFlagModule = mR.findFunction('setValueForFeatureFlag')[0];
  const graphqlRequestModule = mR.findFunction('graphqlRequest')[0];

  if (!featureFlagModule || !graphqlRequestModule) {
    return;
  }

  const {setValueForFeatureFlag} = featureFlagModule;
  const {graphqlRequest} = graphqlRequestModule;

  modifyMustacheTemplate(TD, 'status/tweet_single_actions.mustache', (str) => {
    return str.replace(
      'class="js-reply-action tweet-action position-rel"',
      'class="js-reply-action tweet-action position-rel {{#cannotBeRepliedTo}}is-protected-action no-pointer-events{{/cannotBeRepliedTo}}"'
    );
  });
  modifyMustacheTemplate(TD, 'status/tweet_detail_actions.mustache', (str) => {
    return str.replace(
      'class="js-reply-action tweet-detail-action position-rel"',
      'class="js-reply-action tweet-detail-action position-rel {{#cannotBeRepliedTo}}is-protected-action no-pointer-events{{/cannotBeRepliedTo}}"'
    );
  });

  let conversationMode = TwitterConversationModes.EVERYONE;

  TD.services.TwitterStatus.prototype.OGFromJSON =
    TD.services.TwitterStatus.prototype.fromJSONObject;

  TD.services.TwitterStatus.prototype.fromJSONObject = function fromJSONObject(blob: any) {
    var baseTweet = this.OGFromJSON(blob);

    baseTweet.conversationControl = blob.conversation_control;
    baseTweet.limitedActions = blob.limited_actions;
    baseTweet.cannotBeRepliedTo = blob.limited_actions === 'limited_replies';

    return baseTweet;
  };

  const select = document.createElement('select');
  select.id = 'btd-conversation-control';
  const opt1 = document.createElement('option');
  opt1.value = TwitterConversationModes.EVERYONE;
  opt1.text = 'Everyone';
  const opt2 = document.createElement('option');
  opt2.value = TwitterConversationModes.MENTION;
  opt2.text = 'Mentioned';
  const opt3 = document.createElement('option');
  opt3.value = TwitterConversationModes.FOLLOW;
  opt3.text = 'Follow';

  [opt1, opt2, opt3].forEach((o) => select.options.add(o));

  select.addEventListener('change', (e) => {
    if (!(e.target instanceof HTMLSelectElement)) {
      return;
    }

    conversationMode = e.target.value as TwitterConversationModes;
  });

  onComposerShown((isVisible) => {
    if (!isVisible) {
      document.getElementById('btd-conversation-control')?.remove();
      return;
    }

    document
      .querySelector('.btd-compose-button-wrapper')
      ?.insertAdjacentElement('afterend', select);
  });

  jq(document).on('dataTweetSent', (_e, data) => {
    const accountKey = data.request.accountKey;
    const tweetId = data.response.id_str;
    const client = TD.controller.clients.getClient(accountKey);

    if (!client || conversationMode === TwitterConversationModes.EVERYONE) {
      return;
    }

    const accountState = client.oauth.account;
    setValueForFeatureFlag('graphql_detailed_url_format_enabled', false);
    graphqlRequest({
      queryId: 'hb1elGcj6769uT8qVYqtjw',
      operationName: 'ConversationControlChange',
      variables: {
        tweet_id: tweetId,
        mode: conversationMode,
      },
      account: accountState,
    }).then(() => {
      setValueForFeatureFlag('graphql_detailed_url_format_enabled', true);
    });
  });
});
