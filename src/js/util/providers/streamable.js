export default function ($) {
  return {
    name: 'Streamable',
    setting: 'streamable',
    re: /streamable.com/,
    default: true,
    callback: url => {
      return fetch(`https://api.streamable.com/oembed.json?url=${url}`).then($.statusAndJson)
      .then(data => {
        return {
          type: 'video',
          html: data.html,
          thumbnail_url: $.getSafeURL(data.thumbnail_url),
          url,
        };
      });
    },
  };
}
