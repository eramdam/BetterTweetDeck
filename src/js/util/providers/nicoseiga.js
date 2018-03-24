import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'Nicoseiga',
    setting: 'nicoseiga_jp',
    re: /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?(?:im|mg)/,
    default: true,
    callback: (url) => {
      const id = /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?((?:im|mg)\d+)/.exec(url)[1];
      return fetch($.getSafeURL(`${$.getEnpointFor('nicoseiga')}${id}`))
        .then($.statusAndText)
        .then((html) => {
          const doc = secureDomify.parse(html);
          const imgUrl = secureDomify
            .getAttributeFromNode('img', doc, 'src')
            .replace('q?', 'l?')
            .replace('http:', 'https:');

          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
