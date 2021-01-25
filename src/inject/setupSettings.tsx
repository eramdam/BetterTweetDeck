import {css} from 'emotion';
import {uniqueId} from 'lodash';
import React, {FC, useCallback, useEffect, useRef} from 'react';
import Frame, {FrameContextConsumer} from 'react-frame-component';

import {SettingsModal} from '../components/settings/settingsModal';
import {openFullscreenModalWithReactElement} from '../features/thumbnails/thumbnailHelpers';
import {Handler} from '../helpers/typeHelpers';
import {
  AbstractTweetDeckSettings,
  makeAbstractTweetDeckSettings,
} from '../types/abstractTweetDeckSettings';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

export type OnSettingsUpdateAsync = (
  newBtdSettings: BTDSettings,
  newTdSettings: AbstractTweetDeckSettings
) => void;
export type OnSettingsUpdate = (
  newBtdSettings: BTDSettings,
  newTdSettings: AbstractTweetDeckSettings
) => void;
export const setupSettings = (
  jq: JQueryStatic,
  TD: TweetDeckObject,
  settings: BTDSettings,
  onSettingsUpdate: OnSettingsUpdateAsync
) => {
  // @ts-expect-error
  const originalSettingsHandler = jq._data(document).events['uiShowGlobalSettings'][0].handler;
  jq(document).off('uiShowGlobalSettings');
  jq(document).on('uiShowGlobalSettings', () => {
    const settingsModal = (
      <SettingsWrapperApp
        onOpenTDSettings={() => {
          console.log('opening TD settings');
          originalSettingsHandler();
        }}
        btdSettings={settings}
        tdSettings={makeAbstractTweetDeckSettings(TD)}
        onSettingsUpdate={onSettingsUpdate}
      />
    );
    openFullscreenModalWithReactElement(settingsModal, () => {
      document
        .querySelectorAll('style[btd-stylesheet-id]')
        .forEach((style) => style.removeAttribute('btd-stylesheet-id'));
    });
  });
};

interface SettingsWrapperAppProps {
  onOpenTDSettings: Handler;
  onSettingsUpdate: OnSettingsUpdateAsync;
  btdSettings: BTDSettings;
  tdSettings: AbstractTweetDeckSettings;
}

function createUniqueStyleSheetId() {
  return uniqueId('btd-stylesheet-');
}

const parentDocument = document;
const SettingsWrapperApp: FC<SettingsWrapperAppProps> = (props) => {
  const childDocument = useRef<Document>();
  const {btdSettings, onSettingsUpdate, onOpenTDSettings, tdSettings} = props;

  const onHeaderMutation = useCallback(() => {
    const childDoc = childDocument.current;
    if (!childDoc) {
      return;
    }

    parentDocument.querySelectorAll('style').forEach((style) => {
      if (style.getAttribute('btd-stylesheet-id')) {
        return;
      }

      const styleId = createUniqueStyleSheetId();
      style.setAttribute('btd-stylesheet-id', styleId);
      const element = childDoc.createElement('style');
      element.type = 'text/css';
      element.appendChild(childDoc.createTextNode(style.innerText));
      childDoc.head.appendChild(element);
    });
  }, []);

  useEffect(() => {
    const headObserver = new MutationObserver(onHeaderMutation);
    headObserver.observe(parentDocument.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      headObserver.disconnect();
    };
  }, [onHeaderMutation]);

  return (
    <Frame
      className={css`
        position: fixed;
        z-index: 999;
        height: 90vh;
        width: 75vw;
        max-width: 980px;
        border: 0;
        border-radius: 10px;

        @media (min-height: 600px) {
          min-width: 980px;
          max-height: 1100px;
        }

        @media (max-height: 600px) {
          width: 100vw;
          height: 100vh;
        }
      `}
      contentDidMount={onHeaderMutation}>
      <FrameContextConsumer>
        {({document}) => {
          childDocument.current = document;

          return (
            <SettingsModal
              onOpenTDSettings={onOpenTDSettings}
              onSettingsUpdate={onSettingsUpdate}
              tdSettings={tdSettings}
              btdSettings={btdSettings}></SettingsModal>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
};
