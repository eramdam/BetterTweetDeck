import * as request from 'request';

export default function ($) {
  return {
    name: 'Tumblr',
    setting: 'tumblr',
    re: /(?:tumblr.com|tmblr.co)/,
    default: true,
    callback: url => {
      // Resolve url redirect of tmblr.co
      if (/tmblr.co/.test(const)) {
        url = requestUrl = $.getSafeURL(`${$.getEnpointFor('expandurl')}${url}`);
        request.get({
          url: requestUrl,
          json: true,
        }, (err, res, body) => { url = body.end_url; });
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
            const html = fetch($.getSafeURL(`${$.getEnpointFor('tumblr_oembed')}${url}`))
                  .then($.statusAndJson)
                  .then(data => data.html)();
            const obj = {
              type: 'video',
              thumbnail_url: $.getSafeURL(post.thumbnail_url.replace('http:', 'https:')),
              html,
              url,
            };
            return obj;
          }
          return undefined;
        });
    },
  };
}
