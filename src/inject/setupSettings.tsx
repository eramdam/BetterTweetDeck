import {uniqueId} from 'lodash';
import React, {FC, useEffect, useRef} from 'react';
import Frame, {FrameContextConsumer} from 'react-frame-component';

import {SettingsModal} from '../components/settings/settingsModal';
import {openFullscreenModalWithReactElement} from '../features/thumbnails/thumbnailHelpers';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

type OnSettingsUpdate = (newSettings: BTDSettings) => Promise<BTDSettings>;
export const setupSettings = (
  jq: JQueryStatic,
  settings: BTDSettings,
  onSettingsUpdate: OnSettingsUpdate
) => {
  jq(document).off('uiShowGlobalSettings');
  jq(document).on('uiShowGlobalSettings', () => {
    const settingsModal = (
      <SettingsWrapperApp settings={settings} onSettingsUpdate={onSettingsUpdate} />
    );

    openFullscreenModalWithReactElement(settingsModal);
  });
};

interface SettingsWrapperAppProps {
  onSettingsUpdate: OnSettingsUpdate;
  settings: BTDSettings;
}

function createUniqueStyleSheetId() {
  return uniqueId('btd-stylesheet-');
}

const SettingsWrapperApp: FC<SettingsWrapperAppProps> = (props) => {
  const parentDocument = document;
  const childDocument = useRef<Document>();
  const {settings, onSettingsUpdate} = props;

  useEffect(() => {
    const headObserver = new MutationObserver(() => {
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
    });
    headObserver.observe(parentDocument.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      headObserver.disconnect();
    };
  }, [parentDocument]);

  return (
    <Frame
      style={{
        position: 'fixed',
        zIndex: 9999,
        height: '90vh',
        width: '90vw',
        border: 0,
        borderRadius: 10,
      }}>
      <FrameContextConsumer>
        {({document}) => {
          childDocument.current = document;

          return (
            <SettingsModal
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
