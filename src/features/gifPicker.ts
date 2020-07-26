import {debounce, Dictionary} from 'lodash';
import _ from 'lodash';

import {GifsArray} from '../background/gifRequests';
import {makeGifButton} from '../components/gifButton';
import {makeGifItem, makeGifPicker} from '../components/gifPicker';
import {sendInternalBTDMessage} from '../helpers/communicationHelpers';
import {emptyNode} from '../helpers/domHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';

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

export function setupGifPicker() {
  onComposerShown((isVisible) => {
    if (!isVisible) {
      return;
    }

    const characterCount = document.querySelector('.js-character-count');

    if (!characterCount) {
      return;
    }

    // @ts-expect-error
    const gifButton = makeGifButton({
      onClick: () => {
        document.querySelector('.btd-giphy-zone')?.classList.add('-visible');
        makeGifRequest('trending').then((gifs) => {
          if (gifs) {
            renderGifItems(gifs);
          }
        });
      },
    }) as HTMLElement;
    gifButton.classList.add('-visible');

    characterCount.parentElement!.append(gifButton as any);
    const gifPicker = makeGifPicker({
      onSearchInput: debounce(onSearchInput, 200),
      onCloseClick: closeGifPicker,
    });
    document.querySelector('.js-app')?.insertAdjacentElement('beforeend', gifPicker as any);
  });
}

async function onSearchInput(query: string) {
  const gifsSearchResults = await makeGifRequest('search', {
    limit: '10',
    q: query,
  });

  if (!gifsSearchResults) {
    return;
  }

  resetGifItems();
  renderGifItems(gifsSearchResults);
}

function closeGifPicker() {
  document.querySelector('.btd-giphy-zone')?.classList.remove('-visible');
  resetGifItems();
}

function resetGifItems() {
  emptyNode(document.querySelector('.btd-giphy-zone .giphy-content')!);
}

async function onGifClick(gifUrl: string) {
  const downloadGifResult = await sendMessageToBackground({
    data: {
      requestId: undefined,
      isReponse: false,
      name: BTDMessages.DOWNLOAD_MEDIA,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: gifUrl,
    },
  });
  if (!downloadGifResult) {
    return;
  }

  sendInternalBTDMessage(downloadGifResult);
  closeGifPicker();
}

function renderGifItems(gifs: GifsArray) {
  const gifsElements = gifs?.map((gif) => {
    return makeGifItem({
      previewUrl: gif.preview.url,
      height: gif.preview.height,
      width: gif.preview.width,
      onClick: () => onGifClick(gif.url),
    });
  });

  if (!gifsElements) {
    return;
  }

  const giphyContent = document.querySelector('.btd-giphy-zone .giphy-content');

  if (!giphyContent) {
    return;
  }

  giphyContent.append(...gifsElements.map(insertDomChefElement));
}
