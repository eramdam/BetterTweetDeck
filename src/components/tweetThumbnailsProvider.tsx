import React, {FC, useCallback, useEffect, useState} from 'react';

import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';
import {findProviderForUrl} from '../thumbnails';
import {makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {
  BTDMessageOriginsEnum,
  BTDMessages,
  BTDThumbnailResultEventPayload,
} from '../types/betterTweetDeck/btdMessageTypes';
import {TweetThumbnail} from './tweetThumbnail';

type MaybeThumbnailData = BTDThumbnailResultEventPayload | undefined;

export const TweetThumbnailsProvider: FC = () => {
  const [urlResults, setUrlResults] = useState(new Map<string, MaybeThumbnailData>());

  const updateMap = useCallback(
    (key: string, value: MaybeThumbnailData) => {
      setUrlResults(new Map(urlResults.set(key, value)));
    },
    [urlResults, setUrlResults]
  );

  const removeFromMap = useCallback(
    (keys: readonly string[]) => {
      const newMap = new Map(urlResults);
      keys.forEach((k) => {
        if (newMap.has(k)) {
          newMap.delete(k);
        }
      });

      setUrlResults(newMap);
    },
    [urlResults, setUrlResults]
  );

  useEffect(() => {
    const removeNewChirpListener = listenToInternalBTDMessage(
      BTDMessages.CHIRP_RESULT,
      BTDMessageOriginsEnum.CONTENT,
      async ({data}) => {
        if (data.name !== BTDMessages.CHIRP_RESULT) {
          return;
        }

        const {uuid} = data.payload;

        const tweetNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', uuid));

        if (!tweetNode) {
          return;
        }

        const thumbnailNode = tweetNode.querySelector('.js-media');

        if (thumbnailNode) {
          return;
        }

        const {urls} = data.payload;
        if (!urls || urls.length === 0) {
          return;
        }

        const [targetUrl] = urls;

        if (!findProviderForUrl(targetUrl)) {
          return;
        }

        const urlResult = await sendMessageToBackground({
          data: {
            requestId: undefined,
            isReponse: false,
            name: BTDMessages.FETCH_THUMBNAIL,
            origin: BTDMessageOriginsEnum.CONTENT,
            payload: {
              url: urls[0] || '',
            },
          },
        });

        if (!urlResult || urlResult.name !== BTDMessages.THUMBNAIL_RESULT) {
          return;
        }

        updateMap(data.payload.uuid, urlResult.payload);
      }
    );

    const removeChirpRemovalListener = listenToInternalBTDMessage(
      BTDMessages.CHIRP_REMOVAL,
      BTDMessageOriginsEnum.CONTENT,
      ({data}) => {
        if (data.name !== BTDMessages.CHIRP_REMOVAL) {
          return;
        }

        removeFromMap(data.payload.uuids);
      }
    );

    return () => {
      removeNewChirpListener();
      removeChirpRemovalListener();
    };
  }, [updateMap, removeFromMap]);

  return (
    <div>
      {[...urlResults.entries()].map(([key, value]) => {
        if (!value) {
          return null;
        }

        return <TweetThumbnail key={key} uuid={key} thumbnailPayload={value}></TweetThumbnail>;
      })}
    </div>
  );
};
