import React from 'react';
import Frame, {FrameContextConsumer} from 'react-frame-component';

import {SettingsModal} from '../components/settings/settingsModal';
import {openFullscreenModalWithReactElement} from '../features/thumbnails/thumbnailHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const setupSettings = makeBTDModule(({jq, settings}) => {
  jq(document).off('uiShowGlobalSettings');
  jq(document).on('uiShowGlobalSettings', () => {
    const parentDocument = document;

    const settingsModal = (
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
              <SettingsModal onSettingsUpdate={console.log} settings={settings}></SettingsModal>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    );

    openFullscreenModalWithReactElement(settingsModal);
  });
});
