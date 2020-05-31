import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {
  BTDModalUuidAttribute,
  makeBTDModule,
  makeBtdUuidSelector,
} from '../types/betterTweetDeck/btdCommonTypes';

export const monitorBtdModal = makeBTDModule(({TD}) => {
  const btdPortalTarget = document.querySelector('#btd-fullscreen-portal-target');

  if (!btdPortalTarget) {
    console.warn(`Could not init modal listener`);
    return;
  }

  function getModal() {
    return document.querySelector(`[${BTDModalUuidAttribute}]`);
  }

  function getChirpFromModal(modalWithUuid: Element | null) {
    if (!modalWithUuid) {
      return null;
    }

    const btdUuid = modalWithUuid.getAttribute(BTDModalUuidAttribute) || '';
    const tweetInUI = document.querySelector(makeBtdUuidSelector('data-btd-uuid', btdUuid));

    if (!tweetInUI) {
      return null;
    }

    return getChirpFromElement(TD, tweetInUI);
  }

  const observer = new MutationObserver(() => {
    const modalWithUuid = getModal();

    if (!modalWithUuid) {
      return;
    }

    const chirp = getChirpFromModal(modalWithUuid);

    if (modalWithUuid.querySelectorAll('.js-med-tweet > *').length > 0 || !chirp) {
      return;
    }

    const chirpMarkup = chirp.renderInMediaGallery();

    modalWithUuid.querySelector('.js-med-tweet')?.insertAdjacentHTML('afterbegin', chirpMarkup);
    modalWithUuid.querySelector('.tweet-footer')?.remove();
  });

  observer.observe(btdPortalTarget, {
    childList: true,
    subtree: true,
  });
});
