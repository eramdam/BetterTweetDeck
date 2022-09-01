import ReactDOM, {Root} from 'react-dom/client';
import {Key} from 'ts-key-enum';

import {getFullscreenNodeRoot} from '../types/btdCommonTypes';
import {isHTMLElement} from './domHelpers';
import {Handler} from './typeHelpers';

let fullscreenRoot: Root | undefined = undefined;

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

  mediaElement.style.maxWidth = `${rect.width}px`;
  mediaElement.style.maxHeight = `${rect.height}px`;
});

export function closeFullscreenModal() {
  document.removeEventListener('keydown', onFullscreenKeyDown, true);
  modalObserver.disconnect();

  const fullscreenNode = getFullscreenNodeRoot();

  if (!fullscreenNode || !fullscreenRoot) {
    return;
  }

  fullscreenRoot.unmount();
  fullscreenNode.classList.remove('open');
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
  document.body.style.setProperty(
    '--btd-overlay-background',
    'var(--btd-original-overlay-background)'
  );
}

export function openFullscreenModal(content: JSX.Element) {
  const fullscreenNode = getFullscreenNodeRoot();

  if (!fullscreenNode) {
    return;
  }

  fullscreenRoot = ReactDOM.createRoot(fullscreenNode);
  fullscreenRoot.render(content);

  fullscreenNode.classList.add('open');
  fullscreenNode.addEventListener('click', maybeCloseFullscreenModalOnClick);
  document.addEventListener('keydown', onFullscreenKeyDown, true);

  const target = document.querySelector('[data-btd-modal-content-sizer]');
  if (!target) {
    return;
  }

  modalObserver.observe(target);
}
