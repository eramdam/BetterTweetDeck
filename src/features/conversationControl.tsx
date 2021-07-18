import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';

import {ConversationControlsButton} from '../components/conversationControlsButton';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addConversationControls = makeBTDModule(({TD, jq, mR}) => {
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

  TD.services.TwitterStatus.prototype.OGFromJSON =
    TD.services.TwitterStatus.prototype.fromJSONObject;

  TD.services.TwitterStatus.prototype.fromJSONObject = function fromJSONObject(blob: any) {
    var baseTweet = this.OGFromJSON(blob);

    baseTweet.conversationControl = blob.conversation_control;
    baseTweet.limitedActions = blob.limited_actions;
    baseTweet.cannotBeRepliedTo = blob.limited_actions === 'limited_replies';

    return baseTweet;
  };

  let root: HTMLDivElement | undefined = undefined;

  function unmount() {
    if (!root) {
      return;
    }

    unmountComponentAtNode(root);
  }

  onComposerShown((isVisible) => {
    if (!isVisible) {
      unmount();
      return;
    }

    root = document.createElement('div');
    root.id = 'btdConversationControl';

    document
      .querySelector('.compose-text-container > .txt-right')
      ?.insertAdjacentElement('beforebegin', root);
    ReactDOM.render(
      <ConversationControlsButton
        graphqlRequest={graphqlRequest}
        getClient={TD.controller.clients.getClient}
        jq={jq}
        setValueForFeatureFlag={setValueForFeatureFlag}
      />,
      root
    );
  });
});
