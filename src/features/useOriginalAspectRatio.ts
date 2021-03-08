import {isHTMLElement} from '../helpers/domHelpers';
import {ChirpAddedPayload} from '../inject/chirpHandler';
import {makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckChirp, TweetDeckColumnMediaPreviewSizesEnum} from '../types/tweetdeckTypes';

export function useOriginalAspectRatio(_settings: BTDSettings, addedChirp: ChirpAddedPayload) {
  if (
    addedChirp.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF ||
    addedChirp.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.SMALL
  ) {
    return;
  }

  const chirp = addedChirp.chirp;
  const actualChirp = getUsefulChirp(chirp);
  const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', addedChirp.uuid));

  // If the chirp isn't in the DOM, skip.
  if (!chirpNode) {
    return;
  }

  if (!actualChirp.entities) {
    return;
  }

  const mediaEntities = actualChirp.entities.media;

  // If we don't have any media or we have more than one, skip.
  if (!mediaEntities.length || mediaEntities.length > 1) {
    return;
  }

  const singleMedia = mediaEntities[0];
  const sizeObject = {
    width: singleMedia.sizes.large.w,
    height: singleMedia.sizes.large.h,
  };

  const mediaImageLink = chirpNode.querySelector('.js-media-image-link');

  if (!isHTMLElement(mediaImageLink)) {
    return;
  }

  mediaImageLink.style.height = '0';
  mediaImageLink.style.paddingTop = `calc(${sizeObject.height} / ${sizeObject.width} * 100%)`;
}

const getUsefulChirp = (chirp: TweetDeckChirp) => {
  if (chirp.retweetedStatus) {
    return chirp.retweetedStatus;
  }

  if (chirp.targetTweet) {
    return chirp.targetTweet;
  }

  return chirp;
};
