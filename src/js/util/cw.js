export default function contentWarningHandler(node, tweet) {
  // Skip if we already have a content warning or are in a detail view
  if (node.querySelectorAll('.btd-content-warning, .tweet-detail').length > 0) {
    return false;
  }

  const cwRegex = /^[[]?(?:cw|tw|cn)\W+?\s([^\n|\]]+)[\]]?(?:\n+)?(.+)?$/gi;
  const matches = [...tweet.htmlText.matchAll(cwRegex)];

  if (matches.length > 0) {
    const warning = matches[0][1];
    const text = matches[0][2];

    const details = document.createElement('details');
    details.classList.add('btd-content-warning', 'is-actionable');

    const summary = document.createElement('summary');
    summary.innerHTML = warning;
    details.appendChild(summary);

    if (text) {
      const tweetText = document.createElement('p');
      tweetText.classList.add('tweet-text', 'js-tweet-text', 'with-linebreaks');
      tweetText.innerHTML = text.trim();
      details.appendChild(tweetText);
    }

    // Stopping event propagation because everything inside tweets opens the detail view
    details.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    node.querySelector('.tweet-text').replaceWith(details);
  }
}
