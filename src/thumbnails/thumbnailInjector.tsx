import {makeFullscreenModalWrapper} from '../components/fullscreenModalWrapper';
import {makeMediumThumbnail} from '../components/mediaThumbnails';
import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';
import {BTDUuidAttribute, makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';
import {findProviderForUrl} from '.';
import {closeFullscreenModal, openFullscreenModal} from './thumbnailHelpers';
import {
  BTDUrlProviderImageResult,
  BTDUrlProviderResultTypeEnum,
  BTDUrlProviderVideoResult,
} from './types';

export function setupThumbnailInjector() {
  listenToInternalBTDMessage(
    BTDMessages.CHIRP_RESULT,
    BTDMessageOriginsEnum.CONTENT,
    async ({data}) => {
      if (data.name !== BTDMessages.CHIRP_RESULT) {
        return;
      }

      const {uuid} = data.payload;

      const tweetNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', uuid));
      const thumbnailNode = tweetNode?.querySelector('.js-media');

      if (thumbnailNode) {
        return;
      }

      const urls = data.payload.urls || [];
      const [targetUrl] = urls;

      if (!targetUrl || !findProviderForUrl(targetUrl)) {
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

      if (
        !urlResult ||
        urlResult.name !== BTDMessages.THUMBNAIL_RESULT ||
        urlResult.payload.type === BTDUrlProviderResultTypeEnum.ERROR
      ) {
        return;
      }

      insertThumbnailOnTweet(uuid, urlResult.payload);
    }
  );
}

function insertThumbnailOnTweet(
  uuid: string,
  thumbnailData: BTDUrlProviderImageResult | BTDUrlProviderVideoResult
) {
  const thumbnailNode = document.querySelector(
    `.column article[${BTDUuidAttribute}="${uuid}"] .js-tweet.tweet .tweet-body`
  );

  if (!thumbnailNode) {
    return;
  }

  try {
    const thumbnail = makeMediumThumbnail({
      imageUrl: thumbnailData.thumbnailUrl,
      url: thumbnailData.url,
      onClick: () => {
        const imageModal = makeFullscreenModalWrapper({
          imageStyles: {},
          onClose: closeFullscreenModal,
          url:
            (thumbnailData.type === BTDUrlProviderResultTypeEnum.IMAGE &&
              thumbnailData.fullscreenImageUrl) ||
            '',
        });

        openFullscreenModal(imageModal, uuid);
      },
    });

    thumbnailNode.appendChild<any>(thumbnail);
  } catch (e) {
    console.error(e);
  }
}
