import {format} from 'date-fns';

import {BTDComponent} from '../util/btdClass';

const formatMaps: {
[key: string]: {
full: string;
short: string;
};
} = {
  absolute_us: {
    full: 'MM/DD/YY hh:mm a',
    short: 'hh:mm a',
  },
  absolute_metric: {
    full: 'DD/MM/YY HH:mm',
    short: 'HH:mm',
  },
};

export class Timestamp extends BTDComponent {
  /** Computes whether or not the passed Date object is less than 24h old or not */
  lessThan24 = (d: Date) => new Date().getTime() - d.getTime() <= 60 * 60 * 24000;

  /**
   * Returns the right formatting string according to BTD's settings
   */
  getFormat = (d: Date) => {
    // If the mode defined is "custom" then we use the formatting strings defined by the user
    if (this.settings.ts === 'custom' && this.settings.custom_ts) {
      if (this.settings.full_after_24 && this.lessThan24(d)) {
        return this.settings.custom_ts.short;
      }

      return this.settings.custom_ts.full;
    }

    // We use the formats corresponding to the current timestamp setting
    if (this.settings.full_after_24 && this.lessThan24(d)) {
      return formatMaps[this.settings.ts].short;
    }

    return formatMaps[this.settings.ts].full;
  };

  /**
   * Returns a "pretty" (absolute) time string based on BTD's settings
   * @param {Date} d Date object
   */
  prettyDate = (d: Date) => format(d, this.getFormat(d));
}
