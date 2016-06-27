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
  { name: '500px', setting: '500px', re: /500px.com/ },
  { name: 'Bandcamp', setting: 'bandcamp', re: /bandcamp.com/ },
  { name: 'CloudApp', setting: 'cloudapp', re: /cl.ly/ },
  { name: 'Dailymotion', setting: 'dailymotion', re: /dailymotion.com\/video/ },
  { name: 'DeviantArt', setting: 'deviantart', re: /(?:deviantart.com\/art|fav.me|sta.sh)/ },
  { name: 'Dribbble', setting: 'dribbble', re: /(?:dribbble.com\/shots|drbl.in)/ },
  { name: 'Droplr', setting: 'droplr', re: /d.pr\/i/ },
  { name: 'Flickr', setting: 'flickr', re: /(?:flic.kr|flickr.com)/ },
  { name: 'Gfycat', setting: 'gfycat', re: /gfycat.com/ },
  { name: 'Giphy', setting: 'giphy', re: /(?:giphy.com\/gifs\/|gph.is\/)/ },
  { name: 'img.ly', setting: 'img_ly', re: /img.ly/ },
  { name: 'Imgur', setting: 'imgur', re: /imgur.com/ },
  { name: 'Instagram', setting: 'instagram', re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/ },
  { name: 'moby.to', setting: 'moby_to', re: /moby.to/ },
  { name: 'Soundcloud', setting: 'soundcloud_com', re: /soundcloud.com/ },
  { name: 'Skitch', setting: 'skitch', re: /(?:skitch.com|img.skitch.com)/ },
  { name: 'TED', setting: 'ted', re: /ted.com\/talks/ },
  { name: 'Tumblr', setting: 'tumblr', re: /tumblr.com\/.+.(?:gif|png|jpg)$/ },
  { name: 'Vimeo', setting: 'vimeo', re: /vimeo.com\/[0-9]*$/ },
  { name: 'yfrog', setting: 'yfrog', re: /yfrog.com/ },
  { name: 'Youtu.be', setting: 'youtu_be', re: /youtu.be/ },
  { name: 'Universal', setting: 'universal', re: /.(jpg|gif|png|jpeg)$/ },
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
  if (scheme.re.test(url) && providersSettings[scheme.setting]) {
    return true;
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
