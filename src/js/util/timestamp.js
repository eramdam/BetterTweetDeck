import fecha from 'fecha';
import parseURL from './parseUrl';
import parseSnowFlake from './snowflake';
import { send as sendMessage } from './messaging';

let timestampMode;
let customMode;
let fullAfter24;
let parseDateFromSnowFlake;

sendMessage({ action: 'get', key: 'ts' }, (response) => {
  timestampMode = response.val;
});

sendMessage({ action: 'get', key: 'full_aft_24' }, (response) => {
  fullAfter24 = response.val;
});

sendMessage({ action: 'get', key: 'custom_ts' }, (response) => {
  customMode = response.val;
});

sendMessage({ action: 'get', key: 'date_from_sf' }, (response) => {
  parseDateFromSnowFlake = response.val;
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
  let d;
  const statusURLPattern = /^https:\/\/twitter.com\/.*\/status\/\d+$/;

  if (timestampMode === 'relative') {
    return;
  }

  if (parseDateFromSnowFlake && element.tagName === 'A' && element.href && statusURLPattern.test(element.href)) {
    const preciseDate = parseSnowFlake(parseURL(element.href).file);
    if (preciseDate) d = preciseDate;
  }
  if (!d) d = getDateObject(dateString);

  element.textContent = fecha.format(d, getFormat(d, timestampMode));
}

export default timestampOnElement;
