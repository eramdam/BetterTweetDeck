export default function ($) {
  return {
    name: 'Amazon.com',
    setting: 'amazon',
    re: /(?:amzn.com|amazon.com)/,
    default: true,
    callback: url => {
      return fetch(`${$.getEnpointFor('noembed')}${url}`)
        .then($.statusAndJson)
        .then(data => {
          if (!data.html) {
            return undefined;
          }

          // Use large size image instead of tiny one
          const imgUrl = /<img.+?src="(.+?)"/.exec(data.html)[1].replace('._SL110_', '');
          const obj = {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };

          return obj;
        });
    },
  };
}
