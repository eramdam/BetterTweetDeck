import config from 'config';
import qs from 'query-string';
import reusePromise from 'reuse-promise';

import { send as sendMessage } from './messaging';
import * as Log from './logger';
import { parseURL } from './parseUrl.js';

const endpoints = {
  embedly: 'https://api.embed.ly/1/oembed?',
  '500px': 'https://api.500px.com/v1/photos/',
  dailymotion: 'https://api.dailymotion.com/video/',
  deviantart: 'https://backend.deviantart.com/oembed?',
  dribbble: 'https://api.dribbble.com/v1/shots/',
  noembed: 'https://noembed.com/embed?nowrap=on&url=',
  imgur: 'https://api.imgur.com/3/',
  instagram: 'https://api.instagram.com/oembed?url=',
  twitch: 'https://api.twitch.tv/kraken/',
};

let providersSettings;

sendMessage({ action: 'get', key: 'thumbnails' }, (response) => {
  providersSettings = response.val;
});

const getSafeURL = (url) => {
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  return `https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(url)}&container=focus&resize_w=720&refresh=86400`;
};

const getEnpointFor = (service) => endpoints[service];

const getKeyFor = service => config.get(`Client.APIs.${service}`);

const status = (res) => {
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve(res);
  }

  return Promise.reject(new Error(res.statusText));
};

const json = (res) => {
  if (!res) {
    return null;
  }

  return res.json();
};

const statusAndJson = (res) => status(res).catch(() => null).then(json);

const noEmbedImgCB = url => {
  return fetch(`${getEnpointFor('noembed')}${url}`)
  .then(statusAndJson)
  .then(data => {
    const obj = {
      type: 'image',
      thumbnail_url: getSafeURL(data.media_url),
      url: getSafeURL(data.media_url),
    };

    return obj;
  });
};

const noEmbedVideoCB = url => {
  return fetch(`${getEnpointFor('noembed')}${url}`)
  .then(statusAndJson)
  .then(data => {
    const obj = {
      type: 'video',
      thumbnail_url: getSafeURL(data.thumbnail_url),
      html: data.html,
      url,
    };

    return obj;
  });
};

const schemeWhitelist = [
  {
    name: '500px',
    setting: '500px',
    re: /500px.com/,
    default: true,
    callback: url => {
      const photoID = parseURL(url).segments[1];

      return fetch(`${getEnpointFor('500px')}/${photoID}?${qs.stringify({
        consumer_key: getKeyFor('500px'),
      })}`)
        .then(statusAndJson)
        .then(data => {
          const obj = {
            type: 'image',
            thumbnail_url: getSafeURL(data.photo.image_url),
            url: getSafeURL(data.photo.images[0].https_url),
          };

          return obj;
        });
    },
  },
  // {
  //   name: 'Bandcamp',
  //   setting: 'bandcamp',
  //   re: /bandcamp.com/,
  //   default: true,
  // },
  // {
  //   name: 'CloudApp',
  //   setting: 'cl_ly',
  //   re: /cl.ly/,
  //   default: true,
  // },
  {
    name: 'Dailymotion',
    setting: 'dailymotion',
    re: /dailymotion.com\/video/,
    default: true,
    callback: url => {
      const ID = parseURL(url).segments[1];

      return fetch(`${getEnpointFor('dailymotion')}/${ID}?${qs.stringify({
        fields: 'thumbnail_240_url,thumbnail_360_url,thumbnail_180_url,embed_html',
      })}`)
        .then(statusAndJson)
        .then(data => {
          const obj = {
            type: 'video',
            thumbnail_url: getSafeURL(data.thumbnail_360_url),
            url,
            html: data.embed_html.replace('http://', 'https://'),
          };

          return obj;
        });
    },
  },
  {
    name: 'DeviantArt',
    setting: 'deviantart',
    re: /(?:deviantart.com\/art|fav.me|sta.sh)/,
    default: true,
    callback: url => {
      const sourceURL = url;
      return fetch(`${getEnpointFor('deviantart')}${qs.stringify({
        url: sourceURL,
      })}`)
        .then(statusAndJson)
        .then(data => {
          const obj = {
            type: 'image',
            thumbnail_url: getSafeURL(data.thumbnail_url),
            url: getSafeURL(data.url),
          };

          return obj;
        });
    },
  },
  {
    name: 'Dribbble',
    setting: 'dribbble',
    re: /(?:dribbble.com\/shots|drbl.in)/,
    default: true,
    callback: url => {
      const dribbbleID = parseURL(url).file.split('-').shift();
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${getKeyFor('dribbble')}`);

      return fetch(`${getEnpointFor('dribbble')}${dribbbleID}`, {
        headers,
      })
        .then(statusAndJson)
        .then(data => {
          const obj = {
            type: 'image',
            thumbnail_url: getSafeURL(data.images.teaser),
            url: getSafeURL(data.images.hidpi || data.images.normal),
          };

          return obj;
        });
    },
  },
  {
    name: 'Droplr',
    setting: 'droplr',
    re: /d.pr\/i/,
    default: true,
    callback: url => {
      const dpUrl = getSafeURL(`${url.replace(/\/$/, '')}/medium`);

      return Promise.resolve({
        type: 'image',
        thumbnail_url: dpUrl,
        url: dpUrl,
      });
    },
  },
  {
    name: 'Flickr',
    setting: 'flickr',
    re: /(?:flic.kr|flickr.com)/,
    default: true,
    callback: noEmbedImgCB,
  },
  {
    name: 'Gfycat',
    setting: 'gfycat',
    re: /gfycat.com/,
    default: true,
    callback: url => {
      return fetch(`${getEnpointFor('noembed')}${url}`)
      .then(statusAndJson)
      .then(data => {
        let tbUrl = data.thumbnail_url;
        const ID = parseURL(data.url).segments[0];

        if (!data.thumbnail_url) {
          tbUrl = `https://thumbs.gfycat.com/${ID}-poster.jpg`;
        }

        const obj = {
          type: 'video',
          thumbnail_url: getSafeURL(tbUrl),
          html: data.html,
          url,
        };

        return obj;
      });
    },
  },
  // {
  //   name: 'Giphy',
  //   setting: 'giphy',
  //   re: /(?:giphy.com\/gifs\/|gph.is\/)/,
  //   default: true,
  // },
  {
    name: 'Imgur',
    setting: 'imgur',
    re: /(?:imgur.com|i.imgur.com)/,
    default: true,
    callback: url => {
      const headers = new Headers();
      headers.append('Authorization', `Client-ID ${getKeyFor('imgur')}`);

      if (url.includes('imgur.com/a/')) {
        const imgurID = parseURL(url).segments[1];

        return fetch(`${getEnpointFor('imgur')}/album/${imgurID}`, { headers }).then(statusAndJson)
        .then(data => {
          return {
            type: 'image',
            thumbnail_url: `https://i.imgur.com/${data.data.cover}l.jpg`,
            html: `<iframe class="imgur-album" width="708" height="550" frameborder="0" src="https://imgur.com/a/${imgurID}/embed"></iframe>`,
            url: getSafeURL(url),
          };
        });
      } else if (url.includes('imgur.com/gallery')) {
        const imgurID = parseURL(url).segments[1];

        return fetch(`${getEnpointFor('imgur')}/gallery/image/${imgurID}`, { headers }).then(statusAndJson)
        .then(data => {
          let srcUrl;

          if (data.data.animated) {
            srcUrl = data.data.link;
            return {
              type: 'video',
              thumbnail_url: `https://i.imgur.com/${data.data.id}l.jpg`,
              url,
              html: `<video autoplay src="${data.data.mp4}"></video>`,
            };
          }

          return {
            type: 'image',
            thumbnail_url: `https://i.imgur.com/${data.data.id}l.jpg`,
            url: srcUrl,
          };
        });
      }

      const imgurID = parseURL(url).segments[0].split('.')[0];

      return Promise.resolve({
        type: 'image',
        thumbnail_url: `https://i.imgur.com/${imgurID}l.jpg`,
        url: getSafeURL(`https://i.imgur.com/${imgurID}.jpg`),
      });
    },
  },
  {
    name: 'Instagram',
    setting: 'instagram',
    re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/,
    default: true,
    callback: url => {
      if (!url.endsWith('/')) {
        url += '/';
      }

      return fetch(`${getEnpointFor('instagram')}${url}`).then(statusAndJson)
      .then(data => {
        if (data.html.includes('video')) {
          return {
            type: 'video',
            thumbnail_url: getSafeURL(data.thumbnail_url),
            html: `<iframe src="${url}embed/" width="612" height="710" style="max-height: 710px !important;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`,
            url,
          };
        }

        return {
          type: 'image',
          thumbnail_url: getSafeURL(data.thumbnail_url),
          url: getSafeURL(data.thumbnail_url),
        };
      });
    },
  },
  {
    name: 'Mixcloud',
    setting: 'mixcloud',
    re: /mixcloud.com\/[\w]+\/[\w]+/,
    default: true,
    callback: url => {
      return fetch(`${getEnpointFor('noembed')}${url}`)
      .then(statusAndJson)
      .then(data => {
        const obj = {
          type: 'audio',
          thumbnail_url: getSafeURL(data.image),
          html: data.embed,
          url,
        };

        return obj;
      });
    },
  },
  {
    name: 'moby.to',
    setting: 'moby_to',
    re: /moby.to/,
    default: true,
    callback: noEmbedImgCB,
  },
  {
    name: 'Skitch',
    setting: 'skitch',
    re: /(?:skitch.com|img.skitch.com)/,
    default: true,
    callback: noEmbedImgCB,
  },
  {
    name: 'Soundcloud',
    setting: 'soundcloud',
    re: /soundcloud.com/,
    default: true,
    callback: url => {
      return fetch(`${getEnpointFor('noembed')}${url}`)
      .then(statusAndJson)
      .then(data => {
        const obj = {
          type: 'audio',
          thumbnail_url: getSafeURL(data.thumbnail_url),
          html: data.html,
          url,
        };

        return obj;
      });
    },
  },
  {
    name: 'Spotify',
    setting: 'spotify',
    re: /(?:open.spotify.com|play.spotify.com|spoti.fi)/,
    default: true,
    callback: url => {
      return fetch(`https://embed.spotify.com/oembed/?url=${url}`).then(statusAndJson)
      .then(data => {
        return {
          type: 'audio',
          html: data.html,
          thumbnail_url: getSafeURL(data.thumbnail_url),
          url,
        };
      });
    },
  },
  {
    name: 'Streamable',
    setting: 'streamable',
    re: /streamable.com/,
    default: true,
    callback: url => {
      return fetch(`https://api.streamable.com/oembed.json?url=${url}`).then(statusAndJson)
      .then(data => {
        return {
          type: 'video',
          html: data.html,
          thumbnail_url: getSafeURL(data.thumbnail_url),
          url,
        };
      });
    },
  },
  {
    name: 'TED',
    setting: 'ted',
    re: /ted.com\/talks/,
    default: true,
    callback: noEmbedVideoCB,
  },
  {
    name: 'Tumblr',
    setting: 'tumblr',
    re: /tumblr.com\/.+.(?:gif|png|jpg)$/,
    default: true,
    callback: url => Promise.resolve({
      type: 'image',
      thumbnail_url: getSafeURL(url),
      url: getSafeURL(url),
    }),
  },
  {
    name: 'Twitch',
    setting: 'twitch_tv',
    re: new RegExp('twitch.tv/*|twitch.tv/*/b/*'),
    default: true,
    callback: url => {
      /* eslint no-underscore-dangle: 0 */
      const parsed = parseURL(url);
      const channel = parsed.segments[0];

      const isBroadcast = parsed.segments[1] && ['v', 'b'].includes(parsed.segments[1]);

      if (isBroadcast) {
        const broadcastId = parsed.segments[1] + parsed.segments[2];

        return fetch(`${getEnpointFor('twitch')}channels/${channel}/videos?broadcasts=true&client_id=${getKeyFor('twitch')}`).then(statusAndJson)
        .then(data => {
          const finalVideo = data.videos.find(video => video._id === broadcastId);

          if (!finalVideo) {
            return null;
          }

          return {
            type: 'video',
            thumbnail_url: getSafeURL(finalVideo.thumbnails[0].url),
            html: `<iframe src="https://player.twitch.tv/?video=${broadcastId}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`,
            url,
          };
        });
      }

      return fetch(`${getEnpointFor('twitch')}channels/${channel}?client_id=${getKeyFor('twitch')}`).then(statusAndJson)
      .then(data => {
        return {
          type: 'video',
          thumbnail_url: getSafeURL(data.profile_banner || data.video_banner || data.logo),
          html: `<iframe src="https://player.twitch.tv/?channel=${channel}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`,
          url,
        };
      });
    /* eslint no-underscore-dangle: 1 */
    },
  },
  {
    name: 'Vimeo',
    setting: 'vimeo',
    re: /vimeo.com\/[0-9]*$/,
    default: true,
    callback: noEmbedVideoCB,
  },
  {
    name: 'Youtu.be',
    setting: 'youtu_be',
    re: /youtu.be/,
    default: true,
    callback: noEmbedVideoCB,
  },
  {
    name: 'yfrog',
    setting: 'yfrog',
    re: /yfrog.com/,
    default: true,
    callback: noEmbedImgCB,
  },
  {
    name: 'Universal',
    setting: 'universal',
    re: /.(jpg|gif|png|jpeg)$/,
    default: true,
    callback: url => Promise.resolve({
      type: 'image',
      thumbnail_url: getSafeURL(url),
      url: getSafeURL(url),
    }),
  },
];

const validateUrl = (url) => {
  let provider = '';
  let cb;
  const some = schemeWhitelist.some((scheme) => {
    if (scheme.re.test(url)) {
      if (providersSettings[scheme.setting] === false) {
        return false;
      } else if (providersSettings[scheme.setting] === true || scheme.default) {
        provider = scheme.setting;
        cb = scheme.callback;
        return true;
      }
    }

    return false;
  });

  return { matches: some, provider, cb };
};

function thumbnailForFetch(url) {
  const validationObj = validateUrl(url);

  if (validationObj.cb) {
    Log.debug(`[${validationObj.provider.toUpperCase()}] Fetching ${url}`);
    return validationObj.cb(url);
  }

  Log.debug(`[EMBED.LY] Fetching ${url}`);
  return fetch(`${getEnpointFor('embedly')}${qs.stringify({
    url,
    secure: true,
    scheme: 'https',
    key: getKeyFor('embedly'),
  })}`)
    .then(statusAndJson);
}

const thumbnailFor = reusePromise(thumbnailForFetch);


module.exports = { validateUrl, thumbnailFor, schemeWhitelist };
