import React, {FC, useState, useEffect, useCallback} from 'react';
import {
  BTDThumbnailResultEvent,
  BTDMessages,
  BTDMessageOriginsEnum,
} from '../types/betterTweetDeck/btdMessageTypes';
import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {findProviderForUrl} from '../thumbnails';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';

type MaybeThumbnailData = BTDThumbnailResultEvent['payload'] | undefined;

export const TweetThumbnailsProvider: FC = () => {
  const [urlResults, setUrlResults] = useState(new Map<string, MaybeThumbnailData>());

  const updateMap = useCallback(
    (key: string, value: MaybeThumbnailData) => {
      setUrlResults(new Map(urlResults.set(key, value)));
    },
    [urlResults, setUrlResults]
  );

  useEffect(() => {
    const removeAddEventListener = listenToInternalBTDMessage(
      BTDMessages.CHIRP_RESULT,
      BTDMessageOriginsEnum.CONTENT,
      async ({data}) => {
        if (data.name !== BTDMessages.CHIRP_RESULT) {
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

        console.log(urlResult);

        updateMap(data.payload.uuid, urlResult.payload);
      }
    );

    return () => {
      removeAddEventListener();
    };
  }, [updateMap]);

  return <div></div>;
};
