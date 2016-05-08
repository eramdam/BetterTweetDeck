import fecha from 'fecha';
import { send as sendMessage } from './messaging';

let timestampMode;
let fullAfter24;

sendMessage({ action: 'get', key: 'ts' }, (response) => {
  timestampMode = response.val;
});

sendMessage({ action: 'get', key: 'full_aft_24' }, (response) => {
  fullAfter24 = response.val;
});

const formatMaps = {
  absolute_us: {
    full: 'MM/DD/YY hh:mm a',
    short: 'hh:mm a',
  },
  absolute_metric: {
    full: 'DD/MM/YY HH:mm',
    short: 'HH:mm',
  },
};

function moreThan24(d) {
  return (new Date().getTime() - d.getTime()) <= 60 * 60 * 24000;
}

function getFormat(dateObject, mode) {
  if (fullAfter24 && moreThan24(dateObject)) {
    return formatMaps[mode].short;
  }

  return formatMaps[mode].full;
}

function getDateObject(dateString) {
  if (Number(dateString)) {
    return new Date(Number(dateString));
  }

  return new Date(dateString);
}

function timestampOnElement(element, dateString) {
  if (timestampMode === 'relative') {
    return;
  }

  const d = getDateObject(dateString);

  element.innerHTML = fecha.format(d, getFormat(d, timestampMode));
}

module.exports = timestampOnElement;
