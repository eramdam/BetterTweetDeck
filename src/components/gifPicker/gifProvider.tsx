import {css} from '@emotion/css';
import _, {Dictionary} from 'lodash';
import React, {Fragment, useCallback, useMemo, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {usePopper} from 'react-popper';
import {useVirtual} from 'react-virtual';
import {useDebouncedCallback} from 'use-debounce';

import {sendInternalBTDMessage} from '../../helpers/communicationHelpers';
import {isHTMLElement} from '../../helpers/domHelpers';
import {useIsComposerVisible} from '../../helpers/tweetdeckHelpers';
import {HandlerOf} from '../../helpers/typeHelpers';
import {GifsArray, processGifRequest} from '../../services/backgroundGifRequests';
import {BTDMessageOriginsEnum, BTDMessages} from '../../types/btdMessageTypes';
import {BTDGifButton} from './gifButton';
import {BTDGifPicker} from './gifPicker';
import {BTDGifItem} from './singleGif';

export const BTDGifProvider = () => {
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [loadedGifs, setLoadedGifs] = useState<GifsArray>([]);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [gifButtonRootElement, setGifButtonRootElement] = useState<HTMLDivElement | null>(null);
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
  const [pagination, setPagination] = useState({next: '', offset: 0});
  const gifChunks = useMemo(() => _.chunk(loadedGifs, 3), [loadedGifs]);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtual({
    size: gifChunks.length,
    parentRef,
    estimateSize: useCallback(() => 100, []),
  });

  const onSearchDebounce = useDebouncedCallback(async (query: string) => {
    const gifsSearchResults = await makeGifRequest('search', {
      limit: '25',
      q: query,
      pos: pagination.next,
      offset: pagination.offset,
    });

    if (!gifsSearchResults) {
      return;
    }

    setLoadedGifs(gifsSearchResults.gifs);
    setPagination(gifsSearchResults.pagination);
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

  const onComposerVisibleChange: HandlerOf<boolean> = useCallback((isVisible) => {
    setIsComposerVisible(isVisible);
    if (!isVisible) {
      return;
    }

    const characterCount = document.querySelector('.js-character-count');

    if (!characterCount || !characterCount.parentElement) {
      return;
    }
    const gifRootElement = document.createElement('div');
    gifRootElement.id = 'gif-root-element';
    characterCount.parentElement.appendChild(gifRootElement);
    setGifButtonRootElement(gifRootElement);
    setReferenceElement(document.querySelector<HTMLElement>('.compose-text-container'));
  }, []);

  useIsComposerVisible(onComposerVisibleChange);

  const onGifButtonClick = async () => {
    setIsGifPickerOpen(true);
    const gifsSearchResults = await makeGifRequest('trending', {
      limit: '25',
      pos: pagination.next,
      offset: pagination.offset,
    });

    if (!gifsSearchResults) {
      return;
    }
    console.log(gifsSearchResults);

    setLoadedGifs(gifsSearchResults.gifs);
    setPagination(gifsSearchResults.pagination);
  };

  const gifButton = <BTDGifButton onClick={onGifButtonClick}></BTDGifButton>;

  return (
    <Fragment>
      {isComposerVisible &&
        gifButtonRootElement &&
        ReactDOM.createPortal(gifButton, gifButtonRootElement)}
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
            <div className={css``} ref={parentRef}>
              <div
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  position: 'relative',
                }}>
                {rowVirtualizer.virtualItems.map((chunk) => {
                  return (
                    <div
                      key={chunk.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${chunk.size}px`,
                        transform: `translateY(${chunk.start}px)`,
                        display: 'flex',
                      }}>
                      {gifChunks[chunk.index].map((gif) => {
                        return (
                          <BTDGifItem
                            key={gif.url}
                            height={gif.preview.height}
                            width={gif.preview.width}
                            previewUrl={gif.preview.url}
                            onClick={() => onGifClick(gif.url)}></BTDGifItem>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </BTDGifPicker>
        </div>
      )}
    </Fragment>
  );
};

async function makeGifRequest(
  endpoint: string,
  params: Dictionary<string | number> = {}
): Promise<
  | {
      gifs: GifsArray;
      pagination: {
        next: string;
        offset: number;
      };
    }
  | undefined
> {
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

  const gifPayloads = await Promise.all(gifPromises);
  const validatedGifPayloads = _(gifPayloads)
    .map((e) => e && e.name === BTDMessages.GIF_REQUEST_RESULT && e)
    .compact()
    .map((e) => e.payload.gifs)
    .flatten()
    .shuffle()
    .value();

  if (validatedGifPayloads.length < 1) {
    return undefined;
  }

  return {
    gifs: validatedGifPayloads,
    pagination: {
      next: gifPayloads[1]?.payload.pagination.next || '',
      offset: gifPayloads[0]?.payload.pagination.offset || 0,
    },
  };
}
