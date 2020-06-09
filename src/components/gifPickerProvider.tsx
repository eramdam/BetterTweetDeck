import _, {Dictionary} from 'lodash';
import React, {FC} from 'react';
import {Portal, PortalWithState} from 'react-portal';

import {GifsArray} from '../background/gifRequests';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';
import {GifButton} from '../services/gif/gifButton';
import {getFullscreenNode} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';

export const GifPickerProvider: FC = () => {
  const onGifClick = async () => {
    const gifs = await makeGifRequest('trending');
    console.log(gifs);
  };

  const gifButtonNode = document.querySelector('.compose-text-container > div.txt-right');

  return (
    <PortalWithState node={getFullscreenNode()} closeOnOutsideClick>
      {({portal, openPortal}) => {
        return (
          <>
            <Portal node={gifButtonNode}>
              <GifButton onClick={openPortal}></GifButton>
            </Portal>
            {portal(<div>Hello</div>)}
          </>
        );
      }}
    </PortalWithState>
  );
};

async function makeGifRequest(
  endpoint: string,
  params: Dictionary<string> = {}
): Promise<GifsArray | undefined> {
  const gifPromises = [
    await sendMessageToBackground({
      data: {
        requestId: undefined,
        isReponse: false,
        name: BTDMessages.MAKE_GIF_REQUEST,
        origin: BTDMessageOriginsEnum.CONTENT,
        payload: {
          endpoint,
          source: 'giphy',
          params,
        },
      },
    }),
    await sendMessageToBackground({
      data: {
        requestId: undefined,
        isReponse: false,
        name: BTDMessages.MAKE_GIF_REQUEST,
        origin: BTDMessageOriginsEnum.CONTENT,
        payload: {
          endpoint,
          source: 'tenor',
          params,
        },
      },
    }),
  ];

  const validatedGifPayloads = _(await Promise.all(gifPromises))
    .map((e) => e && e.name === BTDMessages.GIF_REQUEST_RESULT && e)
    .compact()
    .map((e) => e.payload.gifs)
    .flatten()
    .shuffle()
    .value();

  if (validatedGifPayloads.length < 1) {
    return undefined;
  }

  return validatedGifPayloads;
}
