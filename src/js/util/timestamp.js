import fecha from 'fecha';
import { send as sendMessage } from './messaging';

let timestampMode;
let customMode;
let fullAfter24;

sendMessage({ action: 'get', key: 'ts' }, (response) => {
  timestampMode = response.val;
});

sendMessage({ action: 'get', key: 'full_aft_24' }, (response) => {
  fullAfter24 = response.val;
});

sendMessage({ action: 'get', key: 'custom_ts' }, (response) => {
  customMode = response.val;
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

function lessThan24(d) {
  return new Date().getTime() - d.getTime() <= 60 * 60 * 24000;
}

function getFormat(dateObject, mode) {
  if (mode === 'custom') {
    if (fullAfter24 && lessThan24(dateObject)) {
      return customMode.short;
    }

    return customMode.full;
  }
  if (fullAfter24 && lessThan24(dateObject)) {
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

  element.textContent = fecha.format(d, getFormat(d, timestampMode));
}

export default timestampOnElement;
