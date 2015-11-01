import events from './events.js';
let TD2BTD = {};
events.forEach((event) => {
  TD2BTD[event.eventName] = `BTD_${event.eventName}`;
});
const eventsListened = events.filter((ev) => TD2BTD[ev.eventName]);
// This function ill basically shoot a BTD_* event so the content script can intercept it with its data
const proxyEvent = (ev, data) => {
  let event = new CustomEvent(TD2BTD[ev.type], { detail: JSON.stringify(data) });
  document.dispatchEvent(event);
};

// Setting up all the events from the list we got
eventsListened.forEach((event) => {
  if (event.selector.length > 0){
    event.selector.forEach((selector) => $(selector).on(event.eventName, proxyEvent));
  } else {
    $(document).on(event.eventName, proxyEvent);
  }
});

// Will ensure we keep the media preview size value even when the user changes it
$(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
  ev.target.closest('.js-column').setAttribute('data-media-size', data.value);
});

$(document).on('dataColumnFeedUpdated', (ev, data) => {
  console.log('dataColumnFeedUpdated', ev, data);
});

$(document).on('dataTweetSent', (ev, data) => {
  console.log('dataTweetSent', ev, data);
});

// We wait for the loading of the columns and we get all the media preview size
$(document).one('dataColumnsLoaded', () => {
  $('.js-column').each((i, el) => {
    var size = TD.storage.columnController.get($(el).data('column')).getMediaPreviewSize() || 'medium';

    $(el).attr('data-media-size', size);
  });

  let tasks = TD.controller.scheduler._tasks;

  // We delete the callback for the task that refreshes the timestamps so the content script can do it itself
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].period === 30000) {
      console.log('deleting timestamp interval');
      tasks[key].callback = () => false;
    }
  });
});

