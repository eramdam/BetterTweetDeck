import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

/** Removes the t.co redirection on links. */
export const maybeRemoveRedirection = makeBTDModule(({TD, settings}) => {
  if (!settings.removeRedirectionOnLinks) {
    return;
  }
  const dummyEl = document.createElement('span');

  const originalMethod = TD.util.createUrlAnchor;

  if (!originalMethod) {
    return;
  }

  TD.util.createUrlAnchor = (e) => {
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

  TD.services.TwitterUser.prototype.getExpandedURL = function () {
    return this.entities.url.urls[0].expanded_url;
  };

  // Since createUrlAnchor() is not called when rendering the profile website link, modify the template.
  modifyMustacheTemplate(TD, 'twitter_profile.mustache', (template) =>
    template.replace(
      '{{/location}}<a href="{{url}}" class="prf-siteurl js-action-url" target="_blank">{{getDisplayURL}}',
      '{{/location}}<a href="{{getExpandedURL}}" class="prf-siteurl js-action-url" target="_blank">{{getDisplayURL}}'
    )
  );
});
