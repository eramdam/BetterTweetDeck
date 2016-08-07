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

const noEmbedImgCB = url => {
  return fetch(`${getEnpointFor('noembed')}${url}`)
  .then(status)
  .catch(() => null)
  .then(json)
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
  .then(status)
  .catch(() => null)
  .then(json)
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
        .then(status)
        .catch(() => null)
        .then(json)
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
  {
    name: 'Bandcamp',
    setting: 'bandcamp',
    re: /bandcamp.com/,
    default: true,
  },
  {
    name: 'CloudApp',
    setting: 'cl_ly',
    re: /cl.ly/,
    default: true,
  },
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
        .then(status)
        .catch(() => null)
        .then(json)
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
        .then(status)
        .catch(() => null)
        .then(json)
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
        .then(status)
        .catch(() => null)
        .then(json)
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

      return {
        type: 'image',
        thumbnail_url: dpUrl,
        url: dpUrl,
      };
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
  },
  {
    name: 'Giphy',
    setting: 'giphy',
    re: /(?:giphy.com\/gifs\/|gph.is\/)/,
    default: true,
  },
  {
    name: 'Imgur',
    setting: 'imgur',
    re: /(?:imgur.com|i.imgur.com)/,
    default: true,
  },
  {
    name: 'img.ly',
    setting: 'img_ly',
    re: /img.ly/,
    default: true,
  },
  {
    name: 'Instagram',
    setting: 'instagram',
    re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/,
    default: true,
  },
  {
    name: 'Mixcloud',
    setting: 'mixcloud',
    re: /mixcloud.com\/[\w]+\/[\w]+/,
    default: true,
    callback: url => {
      return fetch(`${getEnpointFor('noembed')}${url}`)
      .then(status)
      .catch(() => null)
      .then(json)
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
      .then(status)
      .catch(() => null)
      .then(json)
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
  },
  {
    name: 'Streamable',
    setting: 'streamable',
    re: /streamable.com/,
    default: true,
  },
  {
    name: 'TED',
    setting: 'ted',
    re: /ted.com\/talks/,
    default: true,
    callback: noEmbedVideoCB,
  },
  {
    name: 'TinyGrab',
    setting: 'tinygrab',
    re: /grab.by/,
    default: true,
  },
  {
    name: 'Tumblr',
    setting: 'tumblr',
    re: /tumblr.com\/.+.(?:gif|png|jpg)$/,
    default: true,
    callback: url => {
      return {
        type: 'image',
        thumbnail_url: getSafeURL(url),
        url,
      };
    },
  },
  {
    name: 'Twitch',
    setting: 'twitch_tv',
    re: /twitch.tv/,
    default: true,
  },
  {
    name: 'Vidme',
    setting: 'vid_me',
    re: /(?:vidd.me|vid.me)/,
    default: true,
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
    default: false,
    callback: url => {
      return {
        type: 'image',
        thumbnail_url: getSafeURL(url),
        url,
      };
    },
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
    Log.debug(`Fetching ${url}`);
    return validationObj.cb(url);
  }

  Log.debug(`Fetching ${url}`);
  return fetch(`${getEnpointFor('embedly')}${qs.stringify({
    url,
    secure: true,
    scheme: 'https',
    key: getKeyFor('embedly'),
  })}`)
    .then(status)
    .catch(() => null)
    .then(json);
}

const thumbnailFor = reusePromise(thumbnailForFetch);


module.exports = { validateUrl, thumbnailFor, schemeWhitelist };
