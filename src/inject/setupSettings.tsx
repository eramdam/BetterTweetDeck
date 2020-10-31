import {css} from 'emotion';
import {uniqueId} from 'lodash';
import React, {FC, useCallback, useEffect, useRef} from 'react';
import Frame, {FrameContextConsumer} from 'react-frame-component';

import {SettingsModal} from '../components/settings/settingsModal';
import {openFullscreenModalWithReactElement} from '../features/thumbnails/thumbnailHelpers';
import {Handler} from '../helpers/typeHelpers';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

type OnSettingsUpdate = (newSettings: BTDSettings) => Promise<BTDSettings>;
export const setupSettings = (
  jq: JQueryStatic,
  settings: BTDSettings,
  onSettingsUpdate: OnSettingsUpdate
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
        settings={settings}
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
  onSettingsUpdate: OnSettingsUpdate;
  settings: BTDSettings;
}

function createUniqueStyleSheetId() {
  return uniqueId('btd-stylesheet-');
}

const parentDocument = document;
const SettingsWrapperApp: FC<SettingsWrapperAppProps> = (props) => {
  const childDocument = useRef<Document>();
  const {settings, onSettingsUpdate, onOpenTDSettings} = props;

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
        width: 90vw;
        border: 0;
        border-radius: 10px;

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
              onSettingsUpdate={(newSettings) => {
                onSettingsUpdate(newSettings).then(console.log);
              }}
              settings={settings}></SettingsModal>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
};
