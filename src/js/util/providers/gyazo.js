export default function ($) {
  return {
    name: 'Gyazo',
    setting: 'gyazo',
    re: /gyazo.com/,
    default: true,
    callback: url => {
      return fetch($.getSafeURL(`${$.getEnpointFor('gyazo')}${url}`))
        .then($.statusAndJson)
        .then(data => {
          const obj = {
            type: 'image',
            thumbnail_url: $.getSafeURL(data.url),
            url: $.getSafeURL(data.url),
          };

          return obj;
        });
    },
  };
}
