import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'Crypko',
    setting: 'crypko',
    re: /(?:crypko.ai\/#\/card\/|s.crypko.ai\/c\/)/,
    default: true,
    callback: (url) => {
      if (url.match(/crypko.ai\/#\/card\/(\d+)/)) {
        url = url.replace(/crypko.ai\/#\/card\/(\d+)/, 's.crypko.ai/c/$1');
      }
      return fetch(url.replace('http:', 'https:'))
        .then($.statusAndText)
        .then((html) => {
          const doc = secureDomify.parse(/<head>[^]+<\/head>/m.exec(html)[0]);
          const imgUrl = secureDomify.getAttributeFromNode(
            'meta[property="twitter:image"], meta[property="og:image"]',
            doc,
            'content',
          );
          if (imgUrl === null) {
            return undefined;
          }
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
