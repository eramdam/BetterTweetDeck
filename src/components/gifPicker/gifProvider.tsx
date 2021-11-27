import _, {Dictionary} from 'lodash';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {usePopper} from 'react-popper';
import {useDebouncedCallback} from 'use-debounce';

import {sendInternalBTDMessage} from '../../helpers/communicationHelpers';
import {isHTMLElement} from '../../helpers/domHelpers';
import {useIsComposerVisible} from '../../helpers/tweetdeckHelpers';
import {GifsArray, processGifRequest} from '../../services/backgroundGifRequests';
import {BTDMessageOriginsEnum, BTDMessages} from '../../types/btdMessageTypes';
import {BTDGifButton} from './gifButton';
import {BTDGifPicker} from './gifPicker';
import {BTDGifItem} from './singleGif';

export const BTDGifProvider = () => {
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [loadedGifs, setLoadedGifs] = useState<GifsArray>([]);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const gifButtonRootRef = useRef<HTMLDivElement | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const {styles} = usePopper(referenceElement, popperElement, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          boundary: document.body,
        },
      },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: true,
        },
      },
    ],
  });

  useEffect(() => {
    setReferenceElement(document.querySelector<HTMLElement>('.compose-text-container'));
  }, []);

  const onSearchDebounce = useDebouncedCallback(async (query: string) => {
    const gifsSearchResults = await makeGifRequest('search', {
      limit: '10',
      q: query,
    });

    if (!gifsSearchResults) {
      return;
    }

    setLoadedGifs(gifsSearchResults);
  }, 400);

  const onGifClick = async (gifUrl: string) => {
    sendInternalBTDMessage({
      name: BTDMessages.DOWNLOAD_MEDIA_RESULT,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: {
        url: gifUrl,
        blob: await fetch(gifUrl).then((res) => res.blob()),
      },
    });
    setIsGifPickerOpen(false);
  };

  useIsComposerVisible((isVisible) => {
    setIsComposerVisible(isVisible);
    if (!isVisible) {
      return;
    }

    const characterCount = document.querySelector('.js-character-count');
    if (!characterCount || !characterCount.parentElement) {
      return;
    }
    gifButtonRootRef.current = document.createElement('div');
    characterCount.parentElement.appendChild(gifButtonRootRef.current);
  });

  const onGifButtonClick = async () => {
    setIsGifPickerOpen(true);
    const gifsSearchResults = await makeGifRequest('trending', {});

    if (!gifsSearchResults) {
      return;
    }

    setLoadedGifs(gifsSearchResults);
  };

  const gifButton = <BTDGifButton onClick={onGifButtonClick}></BTDGifButton>;

  return (
    <Fragment>
      {isComposerVisible &&
        gifButtonRootRef.current &&
        ReactDOM.createPortal(gifButton, gifButtonRootRef.current)}
      {isGifPickerOpen && (
        <div
          style={{
            position: 'fixed',
            height: '100vh',
            width: '100vw',
            zIndex: '10000',
            top: 0,
          }}
          onClick={(e) => {
            if (isHTMLElement(e.target) && e.target.closest('.btd-giphy-zone')) {
              return;
            }

            setIsGifPickerOpen(false);
          }}>
          <BTDGifPicker
            ref={setPopperElement}
            style={styles.popper}
            onSearchInput={onSearchDebounce}
            onCloseClick={() => setIsGifPickerOpen(false)}>
            {loadedGifs.map((gif) => {
              return (
                <BTDGifItem
                  key={gif.url}
                  height={gif.preview.height}
                  width={gif.preview.width}
                  previewUrl={gif.preview.url}
                  onClick={() => onGifClick(gif.url)}></BTDGifItem>
              );
            })}
          </BTDGifPicker>
        </div>
      )}
    </Fragment>
  );
};

async function makeGifRequest(
  endpoint: string,
  params: Dictionary<string> = {}
): Promise<GifsArray | undefined> {
  const gifPromises = [
    await processGifRequest({
      requestId: undefined,
      isReponse: false,
      name: BTDMessages.MAKE_GIF_REQUEST,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: {
        endpoint,
        source: 'giphy',
        params,
      },
    }),
    await processGifRequest({
      requestId: undefined,
      isReponse: false,
      name: BTDMessages.MAKE_GIF_REQUEST,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: {
        endpoint,
        source: 'tenor',
        params,
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
