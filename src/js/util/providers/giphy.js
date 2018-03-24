export default function ($) {
  return {
    name: 'Giphy',
    setting: 'giphy',
    re: /(?:giphy.com\/gifs\/|gph.is\/)/,
    default: true,
    callback: (url) => {
      return fetch(`${$.getEnpointFor('giphy')}${url}`)
        .then($.statusAndJson)
        .then((data) => {
          const gifUrl = $.getSafeURL(data.image || data.url);

          return {
            type: 'image',
            thumbnail_url: gifUrl,
            url: gifUrl,
          };
        });
    },
  };
}
