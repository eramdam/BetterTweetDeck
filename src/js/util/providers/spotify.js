export default function ($) {
  return {
    name: 'Spotify',
    setting: 'spotify',
    re: /(?:open.spotify.com|play.spotify.com|spoti.fi)/,
    default: true,
    callback: url => {
      return fetch(`https://embed.spotify.com/oembed?url=${url}`).then($.statusAndJson)
      .then(data => {
        return {
          type: 'audio',
          html: data.html,
          thumbnail_url: $.getSafeURL(data.thumbnail_url),
          url,
        };
      });
    },
  };
}
