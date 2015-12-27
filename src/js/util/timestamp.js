import fecha from 'fecha';
import * as BHelper from './browserHelper';

let timestampMode;

BHelper.settings.get('ts', (val) => {
  timestampMode = val;
});

const formatMaps = {
  'absolute_us': 'MM/DD/YY hh:mm a',
  'absolute_metric': 'DD/MM/YY HH:mm a'
};

const getDateObject = (dateString) => {
  if (Number(dateString))
    return new Date(Number(dateString));

  return new Date(dateString);
};

export default function timestampOnElement(element, dateString) {
  if (timestampMode === 'relative')
    return;

  element.innerHTML = fecha.format(getDateObject(dateString), formatMaps[timestampMode]);
}