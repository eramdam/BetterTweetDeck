import CJSON from 'circular-json';

function onPostMessage(name, cb) {
  window.addEventListener('message', (ev) => {
    if (ev.data.name !== `BTDC_${name}`) {
      return false;
    }

    return cb(ev, ev.data.detail);
  });
}

// Shoots a BTD_* event so the content script can intercept it with its data
const proxyEvent = (ev, data) => {
  const event = new CustomEvent(`BTD_${ev.type}`, { detail: CJSON.stringify(data) });
  document.dispatchEvent(event);
};

const switchThemeClass = () => {
  document.body.dataset.btdtheme = TD.settings.getTheme();
};

// Custom events from BTD's content script
onPostMessage('getOpenModalTweetHTML', (ev, data) => {
  const { tweetKey, colKey, modalHtml } = data;

  if (!TD.controller.columnManager.get(colKey)) {
    return;
  }

  const chirp = TD.controller.columnManager.get(colKey).updateIndex[tweetKey];

  if (!chirp) {
    return;
  }

  const markup = chirp.renderInMediaGallery();

  proxyEvent({ type: 'gotMediaGalleryChirpHTML' }, { markup, chirp, modalHtml });
});

onPostMessage('getChirpFromColumn', (ev, data) => {
  const { chirpKey, colKey } = data;

  if (!TD.controller.columnManager.get(colKey)) {
    return;
  }

  const chirp = TD.controller.columnManager.get(colKey).updateIndex[chirpKey];

  if (!chirp) {
    return;
  }

  proxyEvent({ type: 'gotChirpForColumn' }, { chirp, colKey });
});

// $(document).on('pauseGifForChrip', (ev) => {
//   const { chirpKey, colKey } = ev.originalEvent.detail;
//
//   if (!TD.controller.columnManager.get(colKey)) {
//     return;
//   }
//
//   // TD.controller.columnManager.getAll()['c1463020636333s120'].chirpsWithPlayingGifs
//   // TD.controller.columnManager.getAll()['c1463020636333s120'].ui.pauseGif({id: '730595756940378113'})
// })


// TD Events
$(document).on('uiDetailViewOpening', (ev, data) => {
  setTimeout(() => {
    let chirpsData;

    if (['ONE_TO_ONE', 'GROUP_DM'].includes(data.column.detailViewComponent.chirp.type)) {
      chirpsData = [...data.column.detailViewComponent.chirp.messages];
    } else {
      chirpsData = [
        ...data.column.detailViewComponent.repliesTo.repliesTo || [],
        data.column.detailViewComponent.parentChirp,
        ...data.column.detailViewComponent.replies.replies || []];
    }

    proxyEvent(ev, {
      columnKey: data.column.model.privateState.key,
      // On va manger....DES CHIRPS
      chirpsData,
    });
  }, 1000);
});

$(document).on('dataColumns', (ev, data) => {
  proxyEvent({ type: 'columnsChanged' }, data.columns);
});

$(document).on('uiToggleTheme', switchThemeClass);

// Will ensure we keep the media preview size value even when the user changes it
$(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
  const id = ev.target.closest('.js-column').getAttribute('data-column');

  proxyEvent({ type: 'columnMediaSizeUpdated' }, { id, size: data.value });
});

// We wait for the loading of the columns and we get all the media preview size
$(document).one('dataColumnsLoaded', () => {
  proxyEvent({ type: 'ready' });

  $('.js-column').each((i, el) => {
    let size = TD.storage.columnController.get($(el).data('column')).getMediaPreviewSize();

    if (!size) {
      size = 'medium';
    }

    $(el).attr('data-media-size', size);
  });

  const tasks = TD.controller.scheduler._tasks;

  switchThemeClass();

  // We delete the callback for the timestamp task so the content script can do it itself
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].period === 30000) {
      tasks[key].callback = () => false;
    }
  });
});

$('body').on('click', '#open-modal', (ev) => {
  const isMediaModal = document.querySelector('.js-modal-panel .js-media-preview-container, .js-modal-panel iframe');

  if (!document.body.classList.contains('btd__minimal_mode') ||
  !isMediaModal) {
    return;
  }

  if (!ev.target.closest('.med-tray')
   && !ev.target.closest('.mdl-btn-media') && $('a[rel="dismiss"]')[0]
   && !ev.target.closest('.med-tweet')) {
    ev.preventDefault();
    ev.stopPropagation();

    if ($('#open-modal [btd-custom-modal]').length) {
      $('#open-modal').css('display', 'none');
      $('#open-modal').empty();
      return;
    }

    $('a[rel="dismiss"]').click();
    return;
  }
});
