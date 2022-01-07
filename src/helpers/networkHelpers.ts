import {isString} from 'lodash';

export function buildURLWithSearchParams(url: URL | string, searchParams: object) {
  const finalUrl = isString(url) ? new URL(url) : url;

  Object.entries(searchParams).forEach(([key, value]) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl.toString();
}
