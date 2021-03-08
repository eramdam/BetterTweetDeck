import ReactDOM from 'react-dom';
import {Key} from 'ts-key-enum';

import {
  BTDModalUuidAttribute,
  getFullscreenNodeRoot,
} from '../types/betterTweetDeck/btdCommonTypes';
import {emptyNode, isHTMLElement, maybeDoOnNode, setStylesOnNode} from './domHelpers';
import {Handler, insertDomChefElement} from './typeHelpers';

const onFullscreenKeyDown = (e: KeyboardEvent, beforeClose?: Handler) => {
  if (e.key !== Key.Escape) {
    return;
  }

  if (beforeClose) {
    beforeClose();
  }

  closeFullscreenModal();
};

const modalObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  const rect = entries[0].contentRect;

  const mediaElement = document.querySelector<HTMLImageElement | HTMLVideoElement>(
    '[data-btd-modal-content-sizer] img, [data-btd-modal-content-sizer] video'
  )!;

  setStylesOnNode(mediaElement, {
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

function maybeCloseFullscreenModalOnClick(e: MouseEvent, beforeClose?: Handler) {
  if (
    isHTMLElement(e.target) &&
    e.target.closest('.js-mediatable .js-modal-panel .js-mediaembed, .med-tweet, .mdl-btn-media')
  ) {
    return;
  }

  if (beforeClose) {
    beforeClose();
  }

  closeFullscreenModal();
}

export function openFullscreenModal(content: JSX.Element, btdUuid?: string) {
  const fullscreenNode = getFullscreenNodeRoot();

  if (!fullscreenNode) {
    return;
  }

  fullscreenNode.classList.add('open');
  if (btdUuid) {
    fullscreenNode.setAttribute(BTDModalUuidAttribute, btdUuid);
  }
  fullscreenNode.addEventListener('click', maybeCloseFullscreenModalOnClick);
  document.addEventListener('keydown', onFullscreenKeyDown, true);

  fullscreenNode.appendChild(insertDomChefElement(content));

  const target = document.querySelector('[data-btd-modal-content-sizer]');
  if (!target) {
    return;
  }

  modalObserver.observe(target);
}

export function openFullscreenModalWithReactElement(content: JSX.Element, onClose?: Handler) {
  const fullscreenNode = getFullscreenNodeRoot();

  // Make sure to clean everything in the modal first
  closeFullscreenModal();

  if (!fullscreenNode) {
    return;
  }

  fullscreenNode.classList.add('open');

  const beforeClose = () => {
    ReactDOM.unmountComponentAtNode(fullscreenNode);
    if (onClose) {
      onClose();
    }
  };

  fullscreenNode.addEventListener('click', (e) => {
    return maybeCloseFullscreenModalOnClick(e, beforeClose);
  });
  document.addEventListener(
    'keydown',
    (e) => {
      return onFullscreenKeyDown(e, beforeClose);
    },
    true
  );
  ReactDOM.render(content, fullscreenNode);
}
