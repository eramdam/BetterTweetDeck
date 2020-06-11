import {Key} from 'ts-key-enum';

import {emptyNode, isHTMLElement, maybeDoOnNode, setStylesOnNode} from '../helpers/domHelpers';
import {
  BTDModalUuidAttribute,
  getFullscreenNodeRoot,
} from '../types/betterTweetDeck/btdCommonTypes';

const onFullscreenKeyDown = (e: KeyboardEvent) => {
  if (e.key !== Key.Escape) {
    return;
  }

  closeFullscreenModal();
};

const modalObserver = new ResizeObserver((entries) => {
  const rect = entries[0].contentRect;

  const img = document.querySelector<HTMLImageElement>('[data-btd-modal-content-sizer] img')!;

  setStylesOnNode(img, {
    maxWidth: rect.width,
    maxHeight: rect.height,
  });
});

export function closeFullscreenModal() {
  document.removeEventListener('keydown', onFullscreenKeyDown, true);
  modalObserver.disconnect();
  maybeDoOnNode(getFullscreenNodeRoot(), (node) => {
    emptyNode(node);
    node.classList.remove('open');
  });
}

function maybeCloseFullscreenModalOnClick(e: MouseEvent) {
  if (
    isHTMLElement(e.target) &&
    e.target.closest('.js-mediatable .js-modal-panel .js-mediaembed, .med-tweet, .mdl-btn-media')
  ) {
    return;
  }

  closeFullscreenModal();
}

export function openFullscreenModal(content: JSX.Element, btdUuid: string) {
  const fullscreenNode = getFullscreenNodeRoot();

  if (!fullscreenNode) {
    return;
  }

  fullscreenNode.classList.add('open');
  fullscreenNode.setAttribute(BTDModalUuidAttribute, btdUuid);
  fullscreenNode.addEventListener('click', maybeCloseFullscreenModalOnClick);
  document.addEventListener('keydown', onFullscreenKeyDown, true);

  fullscreenNode.appendChild<any>(content);

  const target = document.querySelector('[data-btd-modal-content-sizer]');
  if (!target) {
    return;
  }

  modalObserver.observe(target);
}
