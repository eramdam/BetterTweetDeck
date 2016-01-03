import CJSON from 'circular-json';

// This function will basically shoot a BTD_* event so the content script can intercept it with its data
const proxyEvent = (ev, data) => {
  const event = new CustomEvent(`BTD_${ev.type}`, { detail: CJSON.stringify(data) });
  document.dispatchEvent(event);
};

const switchThemeClass = () => {
  document.body.dataset.btdtheme = TD.settings.getTheme();
};


// Will push every tweet/DMs and alikes to the content script with an event
$(document).on('uiVisibleChirps', (ev, data) => {
  if (data.chirpsData.length < 1)
    return;

  proxyEvent(ev, data);
});

$(document).on('uiToggleTheme', switchThemeClass);

$(document).on('uiDetailViewOpening', (ev, data) => {
  setTimeout(() => {
    let chirpsData;

    if (['ONE_TO_ONE', 'GROUP_DM'].includes(data.column.detailViewComponent.chirp.type))
      chirpsData = [...data.column.detailViewComponent.chirp.messages];
    else
      chirpsData = [
        ...data.column.detailViewComponent.repliesTo.repliesTo || [],
        data.column.detailViewComponent.parentChirp,
        ...data.column.detailViewComponent.replies.replies || []];

    proxyEvent(ev, {
      columnKey: data.column.model.privateState.key,
      // On va manger....DES CHIRPS
      chirpsData
    });
  }, 500);
});

// Will ensure we keep the media preview size value even when the user changes it
$(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
  ev.target.closest('.js-column').setAttribute('data-media-size', data.value);
});

// We wait for the loading of the columns and we get all the media preview size
$(document).one('dataColumnsLoaded', () => {
  $('.js-column').each((i, el) => {
    const size = TD.storage.columnController.get($(el).data('column')).getMediaPreviewSize() || 'medium';

    $(el).attr('data-media-size', size);
  });

  const tasks = TD.controller.scheduler._tasks;

  switchThemeClass();

  // We delete the callback for the task that refreshes the timestamps so the content script can do it itself
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].period === 30000)
      tasks[key].callback = () => false;
  });
});
