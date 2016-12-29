export default function ($) {
  return {
    name: 'Soundcloud',
    setting: 'soundcloud',
    re: /soundcloud.com/,
    default: true,
    callback: url => {
      return fetch(`${$.getEnpointFor('noembed')}${url}`)
      .then($.statusAndJson)
      .then(data => {
        if (!data.thumbnail_url) {
          return undefined;
        }

        const obj = {
          type: 'audio',
          thumbnail_url: $.getSafeURL(data.thumbnail_url),
          html: data.html,
          url,
        };

        return obj;
      });
    },
  };
}
