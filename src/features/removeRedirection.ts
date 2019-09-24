import {hasProperty} from '../helpers/typeHelpers';

function isTDValid(
  TD: unknown
): TD is {
  util: {
    createUrlAnchor: Function;
  };
} {
  return hasProperty(TD, 'util') && hasProperty(TD.util, 'createUrlAnchor');
}

export const maybeRemoveRedirection = (TD: object) => {
  const dummyEl = document.createElement('span');

  const originalMethod = isTDValid(TD) && TD.util.createUrlAnchor;

  if (!isTDValid(TD) || !originalMethod) {
    return;
  }

  TD.util.createUrlAnchor = (e: any) => {
    // Run the url through the original function first.
    let result = originalMethod(e);

    // Create an in-memory <a> element to store the result of the original function.
    dummyEl.innerHTML = result;
    // Find the anchor inside that result.
    const anchor = dummyEl.querySelector('a');

    if (anchor) {
      anchor.href = anchor.dataset.fullUrl as string;
      result = anchor.outerHTML;
    }

    return result;
  };
};
