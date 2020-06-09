import 'react-devtools';

import {browser} from 'webextension-polyfill-ts';

import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeCollapseDms} from './features/collapseDms';
import {maybeFreezeGifsInProfilePicture} from './features/freezeGifsProfilePictures';
import {maybeMakeComposerButtonsSmaller} from './features/smallerComposerButtons';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {getValidatedSettings} from './services/backgroundSettings';
import {injectInTD} from './services/injectInTD';
import {setupReactRoot} from './services/setupBTDRoot';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

// Inject some scripts
injectInTD();

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  // Setup the React components.
  await setupReactRoot();
  // Add our own class to the body.
  document.body.classList.add('btd-loaded');

  // Get the settings from the browser.
  const settings = await getValidatedSettings();
  changeAvatarsShape({settings});
  maybeMakeComposerButtonsSmaller({settings});
  changeTweetActionsStyling({settings});
  changeScrollbarStyling({settings});
  maybeFreezeGifsInProfilePicture({settings});
  maybeCollapseDms({settings});
});

browser.runtime.onMessage.addListener((details) => {
  switch (details.action) {
    case 'share': {
      document.dispatchEvent(new CustomEvent('uiComposeTweet'));
      const composer = document.querySelector<HTMLTextAreaElement>('textarea.js-compose-text');

      if (!composer) {
        return;
      }

      composer.value = `${details.text} ${details.url}`;
      composer.dispatchEvent(new Event('change'));
      break;
    }
  }
});
