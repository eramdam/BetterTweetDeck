import * as request from 'request';

export default function ($) {
  return {
    name: 'Tumblr',
    setting: 'tumblr',
    re: /(?:tumblr.com|tmblr.co)/,
    default: true,
    callback: url => {
      // Resolve url redirect of tmblr.co
      if (/tmblr.co/.test(url)) {
        const r = request.get($.getSafeURL(url));
        url = r.uri.href.replace('http:', 'https:');
      }
      const match = /([^/]+.tumblr.com)\/\w+\/(\d+)/.exec(url);
      const domain = match[1];
      const id = match[2];
      return fetch($.getSafeURL(
        `${$.getEnpointFor('tumblr')}${domain}/posts?id=${id}&api_key=${$.getKeyFor('tumblr')}`))
        .then($.statusAndJson)
        .then(json => {
          const post = json.response.posts[0];
          if (post.type === 'photo') {
            const imgUrl = post.photos[0].original_size.url.replace('http:', 'https:');
            const obj = {
              type: 'image',
              thumbnail_url: $.getSafeURL(imgUrl),
              url: $.getSafeURL(imgUrl),
            };
            return obj;
          } else if (post.type === 'video') {
            const obj = {
              type: 'video',
              thumbnail_url: $.getSafeURL(post.thumbnail_url.replace('http:', 'https:')),
              html: post.player.slice(-1)[0].embed_code,
              url,
            };
            return obj;
          }
          return undefined;
        });
    },
  };
}
