import events from './events.js';
import CJSON from 'circular-json';
const TD2BTD = {};

Object.keys(events).forEach((event) => {
  TD2BTD[event.eventName] = `BTD_${event.eventName}`;
});
const eventsListened = Object.keys(events);
// This function ill basically shoot a BTD_* event so the content script can intercept it with its data
const proxyEvent = (ev, data) => {
  // console.debug(`${ev.type}`, data);
  const event = new CustomEvent(TD2BTD[ev.type], { detail: CJSON.stringify(data) });
  document.dispatchEvent(event);
};

// Setting up all the events from the list we got
eventsListened.forEach((event) => {
  $(document).on(event, proxyEvent);
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

  // We delete the callback for the task that refreshes the timestamps so the content script can do it itself
  Object.keys(tasks).forEach((key) => {
    if (tasks[key].period === 30000) {
      console.log('deleting timestamp interval');
      tasks[key].callback = () => false;
    }
  });
});

