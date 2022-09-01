import React from 'react';
import {createRoot, Root} from 'react-dom/client';

import {ConversationControlsButton} from '../components/conversationControlsButton';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addConversationControls = makeBTDModule(({TD, jq, mR, settings}) => {
  const featureFlagModule = mR.findModule('setValueForFeatureFlag')[0];
  const isFeatureFlagModule = makeIsModuleRaidModule<{
    setValueForFeatureFlag: (flag: string, value: any) => void;
  }>((mod) => hasProperty(mod, 'setValueForFeatureFlag'));
  const graphqlRequestModule = mR.findModule('graphqlRequest')[0];
  const isGraphqlRequestModule = makeIsModuleRaidModule<{
    graphqlRequest: (opts: any) => Promise<void>;
  }>((mod) => hasProperty(mod, 'graphqlRequest'));

  if (
    !isFeatureFlagModule(featureFlagModule) ||
    !isGraphqlRequestModule(graphqlRequestModule) ||
    !settings.showConversationControl
  ) {
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

  let container: HTMLDivElement | undefined = undefined;
  let root: Root | undefined = undefined;

  function mount() {
    container = document.createElement('div');
    container.id = 'btdConversationControl';
    if (!settings.showGifPicker) {
      container.classList.add('-gif-hidden');
    }

    document
      .querySelector('.compose-text-container > .txt-right')
      ?.insertAdjacentElement('beforebegin', container);
    root = createRoot(container);
    root.render(
      <ConversationControlsButton
        graphqlRequest={graphqlRequest}
        getClient={TD.controller.clients.getClient}
        jq={jq}
        setValueForFeatureFlag={setValueForFeatureFlag}
      />
    );
  }

  function unmount() {
    if (!container || !root) {
      return;
    }

    root.unmount();
  }

  onComposerShown((isVisible) => {
    if (!isVisible) {
      unmount();
      return;
    }

    mount();
  });
});
