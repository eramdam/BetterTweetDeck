import {isObject} from 'lodash';
import ModuleRaid, {ModuleLike} from 'moduleraid';

import {maybeAddColumnsButtons} from './features/addColumnButtons';
import {maybeAddTweetActions} from './features/addTweetActions';
import {maybeAddTweetMenuItems} from './features/addTweetMenuItems';
import {setupAME} from './features/advancedMuteEngine';
import {allowImagePaste} from './features/allowImagePaste';
import {maybeShowCharacterCount} from './features/alwaysShowCharacterCount';
import {setupThemeAutoSwitch} from './features/autoSwitchThemes';
import {putBadgesOnTopOfAvatars} from './features/badgesOnTopOfAvatars';
import {makeEmojiBigger} from './features/biggerEmoji';
import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {maybeSetupCustomTimestampFormat} from './features/changeTimestampFormat';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeCollapseDms} from './features/collapseDms';
import {contentWarnings} from './features/contentWarnings';
import {addConversationControls} from './features/conversationControl';
import {injectCustomCss} from './features/customCss';
import {maybeFreezeGifsInProfilePicture} from './features/freezeGifsProfilePictures';
import {setupGifModals} from './features/gifModals';
import {maybeHideColumnIcons} from './features/hideColumnIcons';
import {hidePreviewButton} from './features/hidePreviewButton';
import {keepTweetedHashtagsInComposer} from './features/keepTweetedHashtags';
import {changeLogo} from './features/logoVariations';
import {makeSearchColumnsFirst} from './features/makeSearchColumnsFirst';
import {useModernOverlays} from './features/modernOverlays';
import {muteNftAvatars} from './features/muteNfts';
import {pauseColumnsOnHover} from './features/pauseColumnsOnHover';
import {addProfileLabels} from './features/profileLabels';
import {displayPronouns} from './features/pronounsDisplay';
import {maybeRemoveRedirection} from './features/removeRedirection';
import {maybeRenderCardsInColumnsNatively} from './features/renderCardsInColumnsNative';
import {renderMediaAndQuotedTweets} from './features/renderMediaAndQuotedTweets';
import {maybeReplaceHeartsByStars} from './features/replaceHeartsByStars';
import {requireAltImages} from './features/requireAltImages';
import {maybeRevertToLegacyReplies} from './features/revertToLegacyReplies';
import {showAvatarsInColumnsHeader} from './features/showAvatarsInColumnsHeader';
import {showTweetDogEars} from './features/showTweetDogEars';
import {maybeMakeComposerButtonsSmaller} from './features/smallerComposerButtons';
import {tweakTweetDeckTheme} from './features/themeTweaks';
import {overrideTranslateLanguage} from './features/translateLanguageOverride';
import {updateTabTitle} from './features/updateTabTitle';
import {updateTwemojiRegex} from './features/updateTwemojiRegex';
import {useOriginalAspectRatio} from './features/useOriginalAspectRatio';
import {maybeChangeUsernameFormat} from './features/usernameDisplay';
import {listenToInternalBTDMessage, sendInternalBTDMessage} from './helpers/communicationHelpers';
import {hasProperty} from './helpers/typeHelpers';
import {setupChirpHandler} from './services/chirpHandler';
import {setupColumnMonitor} from './services/columnMediaSizeMonitor';
import {maybeSetupDebugFunctions} from './services/debugMethods';
import {insertSettingsButton} from './services/setupSettings';
import {BTDModuleOptions, BTDSettingsAttribute} from './types/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages, BTDNotificationTypes} from './types/btdMessageTypes';
import {BTDSettings} from './types/btdSettingsTypes';
import {TweetDeckControllerClient, TweetDeckObject} from './types/tweetdeckTypes';

// Declare typings on the window
declare global {
  interface Window {
    TD: unknown;
  }
}

let mR: ModuleRaid | undefined;
try {
  mR = new ModuleRaid();
} catch (e) {
  console.log(ModuleRaid);
  console.error(e);
}

const TD = window.TD as TweetDeckObject;
// Grab TweetDeck's jQuery from webpack
const jq = mR && mR.findConstructor('jQuery') && mR.findConstructor('jquery:')[0][1];

function isModulejQuery(mod: ModuleLike | undefined): mod is JQueryStatic {
  return hasProperty(mod, 'Animation');
}

(async () => {
  const settings = getBTDSettings();
  if (!settings || !isModulejQuery(jq) || !isObject(TD) || !mR) {
    return;
  }

  const btdModuleOptions = {
    TD,
    jq,
    settings,
    mR,
  };

  // Add custom mustaches.
  TD.mustaches['btd/download_filename_format.mustache'] = settings.downloadFilenameFormat;
  // Marks the DOM to make sure we don't inject our script twice.
  document.body.setAttribute('data-btd-ready', 'true');

  // Setup BTD features
  setupChirpHandler(btdModuleOptions);
  maybeSetupDebugFunctions(btdModuleOptions);
  changeLogo(btdModuleOptions);
  displayPronouns(btdModuleOptions);

  overrideTranslateLanguage(btdModuleOptions);
  makeSearchColumnsFirst(btdModuleOptions);
  makeEmojiBigger(btdModuleOptions);
  pauseColumnsOnHover(btdModuleOptions);
  updateTwemojiRegex(btdModuleOptions);
  putBadgesOnTopOfAvatars(btdModuleOptions);
  useOriginalAspectRatio(btdModuleOptions);
  renderMediaAndQuotedTweets(btdModuleOptions);
  setupGifModals(btdModuleOptions);
  injectCustomCss(btdModuleOptions);
  setupColumnMonitor(btdModuleOptions);
  maybeRemoveRedirection(btdModuleOptions);
  maybeChangeUsernameFormat(btdModuleOptions);
  maybeRevertToLegacyReplies(btdModuleOptions);
  allowImagePaste(btdModuleOptions);
  maybeAddColumnsButtons(btdModuleOptions);
  maybeAddTweetMenuItems(btdModuleOptions);
  maybeAddTweetActions(btdModuleOptions);
  updateTabTitle(btdModuleOptions);
  changeAvatarsShape(btdModuleOptions);
  maybeMakeComposerButtonsSmaller(btdModuleOptions);
  maybeHideColumnIcons(btdModuleOptions);
  changeTweetActionsStyling(btdModuleOptions);
  changeScrollbarStyling(btdModuleOptions);
  maybeFreezeGifsInProfilePicture(btdModuleOptions);
  maybeCollapseDms(btdModuleOptions);
  setupAME(btdModuleOptions);
  maybeReplaceHeartsByStars(btdModuleOptions);
  tweakTweetDeckTheme(btdModuleOptions);
  useModernOverlays(btdModuleOptions);
  insertSettingsButton(btdModuleOptions);
  setupThemeAutoSwitch(btdModuleOptions);
  maybeSetupCustomTimestampFormat(btdModuleOptions);
  maybeShowCharacterCount(btdModuleOptions);
  showTweetDogEars(btdModuleOptions);
  contentWarnings(btdModuleOptions);

  jq(document).one('dataColumnsLoaded', () => {
    document.body.classList.add('btd-loaded');
    hidePreviewButton(btdModuleOptions);
    sendInternalBTDMessage({
      name: BTDMessages.BTD_READY,
      origin: BTDMessageOriginsEnum.INJECT,
      isReponse: false,
      payload: undefined,
    });
    addConversationControls(btdModuleOptions);
    addProfileLabels(btdModuleOptions);
    muteNftAvatars(btdModuleOptions);
    maybeRenderCardsInColumnsNatively(btdModuleOptions);
    showAvatarsInColumnsHeader(btdModuleOptions);
    requireAltImages(btdModuleOptions);
    keepTweetedHashtagsInComposer(btdModuleOptions);
    setTimeout(() => {
      maybeShowFollowBanner(btdModuleOptions);
      if (!settings.needsToShowUpdateBanner) {
        return;
      }

      sendInternalBTDMessage({
        name: BTDMessages.NOTIFICATION,
        origin: BTDMessageOriginsEnum.INJECT,
        isReponse: false,
        payload: {
          type: BTDNotificationTypes.UPDATE,
        },
      });
    }, 2000);
  });
  jq(document).on('uiResetImageUpload', () => {
    jq('.btd-gif-button').addClass('-visible');
    jq('.compose-text-container #btdConversationControl').removeClass('-gif-hidden');
  });

  listenToInternalBTDMessage(
    BTDMessages.DOWNLOAD_MEDIA_RESULT,
    BTDMessageOriginsEnum.INJECT,
    async (ev) => {
      if (ev.data.name !== BTDMessages.DOWNLOAD_MEDIA_RESULT) {
        return;
      }

      const gifFile = new File([ev.data.payload.blob], 'awesome-gif.gif', {
        type: 'image/gif',
      });
      jq(document).trigger('uiFilesAdded', {
        files: [gifFile],
      });
      jq('.btd-gif-button').removeClass('-visible');
      jq('.compose-text-container #btdConversationControl').addClass('-gif-hidden');
    }
  );
})();

/**
Helpers.
 */

/** Parses and returns the settings from the <script> tag as an object. */
function getBTDSettings() {
  const scriptElement = document.querySelector(`[${BTDSettingsAttribute}]`);
  const settingsAttribute = scriptElement && scriptElement.getAttribute(BTDSettingsAttribute);

  try {
    const raw = settingsAttribute && JSON.parse(settingsAttribute);
    return raw as BTDSettings;
  } catch (e) {
    return undefined;
  }
}

const followStatus = (client: TweetDeckControllerClient, targetScreenName: string) => {
  return new Promise<{
    id: string;
    following: boolean;
  }>((resolve) => {
    client.showFriendship(client.oauth.account.state.userId, null, targetScreenName, (result) => {
      return resolve({
        id: client.oauth.account.state.username,
        following: result.relationship.target.followed_by,
      });
    });
  });
};

const followPromptKey = 'btd-disable-follow-prompt-new';

async function maybeShowFollowBanner({TD, jq, settings}: BTDModuleOptions) {
  if (window.localStorage.getItem(followPromptKey) || !settings.showFollowPrompt) {
    return;
  }

  const followingPromises = TD.controller.clients.getClientsByService('twitter').map((client) => {
    return followStatus(client, 'BetterTDeck');
  });

  window.localStorage.setItem(followPromptKey, 'true');
  const values = await Promise.all(followingPromises);

  const shouldShowBanner = values.every((user) => user.following === false);

  if (!shouldShowBanner) {
    return;
  }

  sendInternalBTDMessage({
    name: BTDMessages.NOTIFICATION,
    origin: BTDMessageOriginsEnum.INJECT,
    isReponse: false,
    payload: {
      type: BTDNotificationTypes.FOLLOW_PROMPT,
    },
  });
  listenToInternalBTDMessage(
    BTDMessages.PROMPT_FOLLOW,
    BTDMessageOriginsEnum.INJECT,
    async (ev) => {
      if (ev.data.name !== BTDMessages.PROMPT_FOLLOW) {
        return;
      }

      jq(document).trigger('uiShowProfile', {id: 'BetterTDeck'});
    }
  );
}
