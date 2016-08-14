export default function ($) {
  return {
    name: 'Giphy',
    setting: 'giphy',
    re: /(?:giphy.com\/gifs\/|gph.is\/)/,
    default: true,
    callback: url => {
      return fetch(`${$.getEnpointFor('giphy')}${url}`).then($.statusAndJson)
      .then(data => {
        return {
          type: 'image',
          thumbnail_url: $.getSafeURL(data.image.replace('giphy.gif', 'giphy-facebook_s.jpg')),
          url: $.getSafeURL(data.image),
        };
      });
    },
  };
}
