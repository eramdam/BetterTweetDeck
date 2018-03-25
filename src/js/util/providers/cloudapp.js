export default function ($) {
  return {
    name: 'CloudApp',
    setting: 'cl_ly',
    re: /cl.ly/,
    default: true,
    callback: (url) => {
      const headers = new Headers();
      headers.append('Accept', 'application/json');

      return fetch(url, { headers })
        .then($.statusAndJson)
        .then((data) => {
          if (data.item_type !== 'image') {
            return null;
          }

          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(data.thumbnail_url),
            url: $.getSafeURL(data.content_url),
          };
        });
    },
  };
}
