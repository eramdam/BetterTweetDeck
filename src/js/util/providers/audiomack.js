export default function($) {
  return {
    name: 'Audiomack',
    setting: 'audiomack',
    re: /audiomack.com\/(song|album|playlist)/,
    default: true,
    callback: (url) => {
      return fetch(`${$.getEnpointFor('audiomack')}${url}`)
        .then($.statusAndJson)
        .then((json) => {
          if (!json.html) {
            return undefined;
          }

          return {
            type: 'audio',
            thumbnail_url: $.getSafeURL(json.thumbnail_url),
            html: json.html,
            url,
          };
        });
    },
  };
}
