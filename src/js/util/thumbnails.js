import config from 'config';
import qs from 'query-string';
import reusePromise from 'reuse-promise';

import { send as sendMessage } from './messaging';

const endpoints = {
  embedly: 'https://api.embed.ly/1/oembed?',
};

let providersSettings;

sendMessage({ action: 'get', key: 'thumbnails' }, (response) => {
  providersSettings = response.val;
});

const schemeWhitelist = [
  { name: '500px', setting: '500px', re: /500px.com/, default: true },
  { name: 'Bandcamp', setting: 'bandcamp', re: /bandcamp.com/, default: true },
  { name: 'CloudApp', setting: 'cl_ly', re: /cl.ly/, default: true },
  { name: 'Dailymotion', setting: 'dailymotion', re: /dailymotion.com\/video/, default: true },
  { name: 'DeviantArt', setting: 'deviantart', re: /(?:deviantart.com\/art|fav.me|sta.sh)/, default: true },
  { name: 'Dribbble', setting: 'dribbble', re: /(?:dribbble.com\/shots|drbl.in)/, default: true },
  { name: 'Droplr', setting: 'droplr', re: /d.pr\/i/, default: true },
  { name: 'Flickr', setting: 'flickr', re: /(?:flic.kr|flickr.com)/, default: true },
  { name: 'Gfycat', setting: 'gfycat', re: /gfycat.com/, default: true },
  { name: 'Giphy', setting: 'giphy', re: /(?:giphy.com\/gifs\/|gph.is\/)/, default: true },
  { name: 'img.ly', setting: 'img_ly', re: /img.ly/, default: true },
  { name: 'Imgur', setting: 'imgur', re: /imgur.com/, default: true },
  { name: 'Instagram', setting: 'instagram', re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/, default: true },
  { name: 'moby.to', setting: 'moby_to', re: /moby.to/, default: true },
  { name: 'Mixcloud', setting: 'mixcloud', re: /mixcloud.com\/[\w]+\/[\w]+/, default: true },
  { name: 'Soundcloud', setting: 'soundcloud', re: /soundcloud.com/, default: true },
  { name: 'Skitch', setting: 'skitch', re: /(?:skitch.com|img.skitch.com)/, default: true },
  { name: 'Spotify', setting: 'spotify', re: /(?:open.spotify.com|play.spotify.com|spoti.fi)/, default: true },
  { name: 'Streamable', setting: 'streamable', re: /streamable.com/, default: true },
  { name: 'TED', setting: 'ted', re: /ted.com\/talks/, default: true },
  { name: 'Tumblr', setting: 'tumblr', re: /tumblr.com\/.+.(?:gif|png|jpg)$/, default: true },
  { name: 'Twitch', setting: 'twitch_tv', re: /twitch.tv/, default: true },
  { name: 'Vimeo', setting: 'vimeo', re: /vimeo.com\/[0-9]*$/, default: true },
  { name: 'yfrog', setting: 'yfrog', re: /yfrog.com/, default: true },
  { name: 'Youtu.be', setting: 'youtu_be', re: /youtu.be/, default: true },
  { name: 'Vidme', setting: 'vid_me', re: /(?:vidd.me|vid.me)/, default: true },
  { name: 'Universal', setting: 'universal', re: /.(jpg|gif|png|jpeg)$/, default: true },
];

const getEnpointFor = (service) => endpoints[service];

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

const validateUrl = (url) => schemeWhitelist.some((scheme) => {
  if (scheme.re.test(url)) {
    if (providersSettings[scheme.setting] === false) {
      return false;
    } else if (providersSettings[scheme.setting] === true || scheme.default) {
      return true;
    }
  }

  return false;
});

function thumbnailForFetch(url) {
  console.debug(`Fetching ${url}`);
  return fetch(`${getEnpointFor('embedly')}${qs.stringify({
    url,
    secure: true,
    scheme: 'https',
    key: config.get('Client.APIs.embedly'),
  })}`)
    .then(status)
    .catch(() => null)
    .then(json);
}

const thumbnailFor = reusePromise(thumbnailForFetch);

module.exports = { validateUrl, thumbnailFor, schemeWhitelist };
