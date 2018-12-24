import {format} from 'date-fns';

import {BTDModule, BTDSettings, BTDTimeFormatsEnum} from '../types';

const formatMaps: {
[key in BTDTimeFormatsEnum]?: {
full: string;
short: string;
}
} = {
  absolute_us: {
    full: 'MM/DD/YY hh:mm a',
    short: 'hh:mm a'
  },
  absolute_metric: {
    full: 'DD/MM/YY HH:mm',
    short: 'HH:mm'
  }
};

const prettyDate = (d: Date, settings: BTDSettings) => format(d, formatMaps.absolute_metric!.full);

export const maybeAddCustomDate: BTDModule = (settings, TD) => {
  if (settings.ts === BTDTimeFormatsEnum.RELATIVE) {
    return;
  }

  TD.util.prettyDate = (d: Date) => prettyDate(d, settings);
};
