import format from 'date-fns/format';

import { BTDComponent } from './btdClass';

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

export class Time extends BTDComponent {
  lessThan24 = d => new Date().getTime() - d.getTime() <= 60 * 60 * 24000;

  getFormat = (d) => {
    if (this.settings.ts === 'custom') {
      if (this.settings.full_after_24 && this.lessThan24(d)) {
        return this.settings.custom_ts.short;
      }

      return this.settings.custom_ts.full;
    }

    if (this.settings.full_after_24 && this.lessThan24(d)) {
      return formatMaps[this.settings.ts].short;
    }

    return formatMaps[this.settings.ts].full;
  };
  prettyDate = d => format(d, this.getFormat(d));
}
