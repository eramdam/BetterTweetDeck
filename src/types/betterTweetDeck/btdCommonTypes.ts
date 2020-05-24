import {TweetDeckObject} from '../tweetdeckTypes';

export type BTDModule = (TD: TweetDeckObject, $: JQueryStatic) => void;

export const BTDSettingsAttribute = 'data-btd-settings';
export const BTDUuidAttribute = 'data-btd-uuid';
export const BTDModalUuidAttribute = 'data-btd-modal-uuid';

const UuidSelectors = [BTDUuidAttribute, BTDModalUuidAttribute] as const;

export function makeBtdUuidSelector(
  uuidSelectors: typeof UuidSelectors[number],
  uuid: string,
  suffix = ''
) {
  return `[${uuidSelectors}="${uuid}"] ${suffix}`.trim();
}
