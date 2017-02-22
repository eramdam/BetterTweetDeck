export default function ($) {
  return {
    name: 'Tumblr',
    setting: 'tumblr',
    re: /(?:tumblr.com|tmblr.co)/,
    default: true,
    callback: url => {
      return fetch(
        $.getSafeURL(`${$.getEnpointFor('embedly')}key=${$.getKeyFor('embedly')}&url=${url}`))
        .then($.statusAndJson)
        .then(json => {
          if (json.type !== 'photo') {
            return undefined;
          }
          const thumbnailUrl = json.thumbnail_url.replace(json.thumbnail_width, '500').replace('http:', 'https:');
          const imgUrl = json.url.replace('http:', 'https:');
          const obj = {
            type: 'image',
            thumbnail_url: $.getSafeURL(thumbnailUrl),
            url: $.getSafeURL(imgUrl),
          };
          return obj;
        });
    },
  };
}
