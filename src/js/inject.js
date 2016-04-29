import CJSON from 'circular-json';

// Shoots a BTD_* event so the content script can intercept it with its data
const proxyEvent = (ev, data) => {
  const event = new CustomEvent(`BTD_${ev.type}`, { detail: CJSON.stringify(data) });
  document.dispatchEvent(event);
};

const switchThemeClass = () => {
  document.body.dataset.btdtheme = TD.settings.getTheme();
};


// @TODO: plug on DOM inserted node of columns and shoot models
// the "old" way of discovering new stuff
// Only triggers when the content is _visible_ to the screen
$(document).on('uiVisibleChirps', (ev, data) => {
  if (data.chirpsData.length < 1) {
    return;
  }

  proxyEvent(ev, data);
});

// Will push every tweet/DMs and alikes to the content script with an event
$(document).on('uiColumnChirpsChanged', (ev, data) => {
  const column = TD.controller.columnManager.get(data.id);

  proxyEvent({ type: 'newColumnContent' }, column);
});

$(document).on('dataColumns', (ev, data) => {
  proxyEvent({ type: 'columnsChanged' }, data.columns);
});

$(document).on('uiToggleTheme', switchThemeClass);

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

// Will ensure we keep the media preview size value even when the user changes it
$(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
  ev.target.closest('.js-column').setAttribute('data-media-size', data.value);
});

// We wait for the loading of the columns and we get all the media preview size
$(document).one('dataColumnsLoaded', () => {
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

$('body').on('click', '.js-modal-panel', (ev) => {
  if (!document.body.classList.contains('btd__minimal_mode')) {
    return;
  }

  if (!ev.target.closest('.med-tray') && !ev.target.closest('.mdl-btn-media')) {
    ev.preventDefault();
    ev.stopPropagation();

    $('a[rel="dismiss"]').click();
    return;
  }
});
