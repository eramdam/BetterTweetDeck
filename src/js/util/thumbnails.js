import config from 'config';
import reusePromise from 'reuse-promise';

import { send as sendMessage } from './messaging';
import * as Log from './logger';
import * as Providers from './providers/index';

const endpoints = {
  embedly: 'https://api.embed.ly/1/oembed?',
  '500px': 'https://500px.com/oembed?format=json&url=',
  dailymotion: 'https://api.dailymotion.com/video/',
  deviantart: 'https://backend.deviantart.com/oembed?',
  dribbble: 'https://api.dribbble.com/v1/shots/',
  noembed: 'https://noembed.com/embed?nowrap=on&url=',
  imgur: 'https://api.imgur.com/3/',
  instagram: 'https://api.instagram.com/oembed?url=',
  twitch: 'https://api.twitch.tv/kraken/',
  giphy: 'https://giphy.com/services/oembed?url=',
};

let providersSettings;

sendMessage({ action: 'get', key: 'thumbnails' }, (response) => {
  providersSettings = response.val;
});

/**
 * Returns a 'safe' URL for images to use as background-image/src value
 * @param  {String} url url of image
 * @return {String}     safe url
 */
const getSafeURL = (url) => {
  if (!url) {
    return '';
  }

  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  return `https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(url)}&container=focus&resize_w=720&refresh=86400`;
};

/**
 * Returns the endpoint for the asked service
 * @param  {String} service key of service from `endpoints` object
 * @return {String}         url to fetch
 */
const getEnpointFor = (service) => endpoints[service];

/**
 * Returns API key from config for a given servic3e
 * @param  {String} service Name of service
 * @return {String}         API key of service
 */
const getKeyFor = service => config.get(`Client.APIs.${service}`);

/**
 * Function to use in promise that will return the json output of a request
 */
const statusAndJson = res => {
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  }

  return Promise.reject(new Error(res.statusText));
};

/**
 * Returns a promise with image data from noembed
 */
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

/**
 * Returns a promise with video data from noembed
 */
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

// We export a few useful functions for providers
const util = { getKeyFor, statusAndJson, getEnpointFor, getSafeURL, noEmbedVideoCB, noEmbedImgCB };

const schemeWhitelist = [
  Providers.fivehundredpx(util),
  Providers.bandcamp(util),
  Providers.cloudapp(util),
  Providers.dailymotion(util),
  Providers.deviantart(util),
  Providers.dribbble(util),
  Providers.droplr(util),
  Providers.flickr(util),
  Providers.gfycat(util),
  Providers.giphy(util),
  Providers.imgur(util),
  Providers.instagram(util),
  Providers.mixcloud(util),
  Providers.mobyTo(util),
  Providers.skitch(util),
  Providers.soundcloud(util),
  Providers.spotify(util),
  Providers.streamable(util),
  Providers.ted(util),
  Providers.tumblr(util),
  Providers.twitch(util),
  Providers.vimeo(util),
  Providers.youtube(util),
  Providers.yfrog(util),
  Providers.universal(util),
];

const validateUrl = (url) => {
  let provider = '';
  let cb;

  // We test every scheme to see if the url matches one of them
  const some = schemeWhitelist.some((scheme) => {
    if (scheme.re.test(url)) {
      if (providersSettings[scheme.setting] === false) {
        return false;
      } else if (providersSettings[scheme.setting] === true || scheme.default) {
        // We an url matches, we stop and
        // get the corresponding provider/callback func
        provider = scheme.setting;
        cb = scheme.callback;
        return true;
      }
    }

    return false;
  });

  // We return whether the url matches and some additional info
  return { matches: some, provider, cb };
};

function thumbnailForFetch(url) {
  const validationObj = validateUrl(url);
  const cleanUrl = new URL(url);
  cleanUrl.search = '';
  url = cleanUrl.toString();

  if (!validationObj.cb) {
    return Promise.reject();
  }

  Log.debug(`[${validationObj.provider.toUpperCase()}] Fetching ${url}`);
  return validationObj.cb(url);
}

// We use reuse-promise so we don't have to fetch the same URL twice
const thumbnailFor = reusePromise(thumbnailForFetch);

module.exports = { validateUrl, thumbnailFor, schemeWhitelist, getSafeURL };
