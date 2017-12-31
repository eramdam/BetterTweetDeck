import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'Pixiv',
    setting: 'pixiv_net',
    re: /pixiv\.net\/(?:member_illust\.php|novel\/|i\/|n\/)/,
    default: true,
    callback: (url) => {
      return fetch($.getSafeURL(url))
        .then($.statusAndText)
        .then((html) => {
          // Only domify <head> part to prevent from making requests for i.pximg.net
          const doc = secureDomify.parse(/<head>[^]+<\/head>/m.exec(html)[0]);
          const imgUrl = secureDomify.getAttributeFromNode('meta[property="twitter:image"]', doc, 'content')
            || secureDomify.getAttributeFromNode('meta[property="og:image"]', doc, 'content');
          if (imgUrl === null || imgUrl.includes('pixiv_logo')) return undefined;
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}


