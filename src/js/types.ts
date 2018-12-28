/* eslint camelcase: 0 */

export enum BTDTimeFormatsEnum {
  ABSOLUTE_US = 'absolute_us',
  ABSOLUTE_METRIC = 'absolute_metric',
  CUSTOM = 'custom',
  RELATIVE = 'relative'
}

export interface BTDSettings {
  ts: BTDTimeFormatsEnum;
  full_after_24: boolean;
  no_tco: boolean;
  custom_ts?: {
    short: string;
    full: string;
  };
}
export const BTD_CUSTOM_ATTRIBUTE = 'data-btd-custom';
export type BTDModule = (settings: BTDSettings, TD: any) => void;
export type BTDModuleWithHandler<T> = (settings: BTDSettings, TD: any, handler: HandlerOf<T>) => void;

/**
 * Recurring types.
 */
export type Handler = () => void;
export type HandlerOf<T> = (blob: T) => void;
