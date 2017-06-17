export default function ($) {
  return {
    name: 'Mixcloud',
    setting: 'mixcloud',
    re: /mixcloud.com\/[\w]+\/[\w]+/,
    default: true,
    callback: (url) => {
      return fetch(`${$.getEnpointFor('noembed')}${url}`)
        .then($.statusAndJson)
        .then((data) => {
          const obj = {
            type: 'audio',
            thumbnail_url: $.getSafeURL(data.image),
            html: data.embed,
            url,
          };

          return obj;
        });
    },
  };
}
