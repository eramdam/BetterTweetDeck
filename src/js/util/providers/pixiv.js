import * as secureDomify from '../secureDomify';

export default function($) {
  return {
    name: 'Pixiv',
    setting: 'pixiv_net',
    re: /pixiv\.net\/(?:member_illust\.php\?.*(?:mode=)|en|novel\/|i\/|n\/)/,
    default: true,
    callback: (url) => {
      return fetch(url.replace('http:', 'https:'))
        .then($.statusAndText)
        .then((html) => {
          // Only domify <head> part to prevent from making requests for i.pximg.net
          const doc = secureDomify.parse(/<head>[^]+<\/head>/m.exec(html)[0]);
          const imgUrl = secureDomify.getAttributeFromNode(
            'meta[data-property="twitter:image"], meta[data-property="og:image"]',
            doc,
            'content'
          );
          if (imgUrl === null || imgUrl.includes('pixiv_logo')) {
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
