import parseURL from '../parseUrl';

export default function($) {
  return {
    name: 'Dribbble',
    setting: 'dribbble',
    re: /(?:dribbble.com\/shots|drbl.in)/,
    default: true,
    callback: (url) => {
      const dribbbleID = parseURL(url)
        .file.split('-')
        .shift();
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${$.getKeyFor('dribbble')}`);

      return fetch(`${$.getEnpointFor('dribbble')}${dribbbleID}`, {
        headers,
      })
        .then($.statusAndJson)
        .then((data) => {
          const obj = {
            type: 'image',
            thumbnail_url: $.getSafeURL(data.images.teaser),
            url: $.getSafeURL(data.images.hidpi || data.images.normal),
          };

          return obj;
        });
    },
  };
}
