import convert from 'xml-js';

export default function ($) {
  return {
    name: 'Nicoseiga',
    setting: 'nicoseiga_jp',
    re: /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?(?:im|mg)/,
    default: true,
    callback: url => {
      const id = /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?((?:im|mg)\d+)/.exec(url)[1];
      return fetch($.getSafeURL(`${$.getEnpointFor('nicoseiga')}${id}`))
        .then($.statusAndText)
        .then(html => {
          const imgUrl = /<img src="(http:\/\/lohas.+?)"/.exec(html)[1]
                .replace('q?', 'l?');
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
