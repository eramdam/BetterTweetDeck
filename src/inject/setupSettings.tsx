import React, {FC} from 'react';
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
const SettingsWrapperApp: FC<SettingsWrapperAppProps> = (props) => {
  const parentDocument = document;
  const {settings, onSettingsUpdate} = props;

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
          const childDocument: Document = document;

          parentDocument.querySelectorAll('style').forEach((style) => {
            const element = childDocument.createElement('style');
            element.type = 'text/css';
            element.appendChild(childDocument.createTextNode(style.innerText));
            childDocument.head.appendChild(element);
          });

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
