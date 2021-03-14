import {makeBTDModule} from '../types/btdCommonTypes';

export const allowImagePaste = makeBTDModule(({jq}) => {
  document.addEventListener('paste', (ev) => {
    if (!ev.clipboardData || !ev.target) {
      return;
    }

    const items = ev.clipboardData.items;

    if (!items) {
      return;
    }

    const files: File[] = [];

    Array.from(items).forEach((item) => {
      if (item.type.indexOf('image') < 0) {
        return;
      }
      const blob = item.getAsFile();
      if (!blob) {
        return;
      }

      files.push(blob);
    });

    if (files.length === 0) {
      return;
    }

    const canPopout =
      jq('.js-inline-compose-pop, .js-reply-popout').length > 0 &&
      !jq('.js-app-content').hasClass('is-open');

    const findTextbox = jq(ev.target)
      .closest('.js-column')
      .find('.js-inline-compose-pop, .js-reply-popout');

    if (canPopout) {
      if (findTextbox.length > 0) {
        jq(findTextbox).trigger('click');
      } else {
        jq('.js-inline-compose-pop, .js-reply-popout').first().trigger('click');
      }

      setTimeout(() => {
        jq(document).trigger('uiFilesAdded', {
          files,
        });
      }, 0);
      return;
    }

    jq(document).trigger('uiFilesAdded', {
      files,
    });
  });
});
