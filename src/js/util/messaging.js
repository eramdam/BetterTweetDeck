const baseMsgTransit = (sourceKey, destinationKey) => data =>
  new Promise((resolve) => {
    // We compute a "hash" with performance.now(), should be simple enough for now
    const hash = performance.now();

    // We register a listener
    window.addEventListener('message', function currListener(ev) {
      // If the message doesn't come from TD, doesn't come from the content script,
      if (
        ev.origin !== 'https://tweetdeck.twitter.com' ||
        ev.data.origin !== destinationKey ||
        ev.data.hash !== hash
      ) {
        return;
      }

      resolve(ev);
      window.removeEventListener('message', currListener);
    });

    window.postMessage(Object.assign(data, {
      origin: sourceKey,
      hash,
    }), 'https://tweetdeck.twitter.com');
  });


export const msgToContent = baseMsgTransit('BTD_INJECT', 'BTD_CONTENT');
export const msgToInject = baseMsgTransit('BTD_CONTENT', 'BTD_INJECT');
