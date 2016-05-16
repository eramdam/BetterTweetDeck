import config from 'config';
import qs from 'query-string';
import reusePromise from 'reuse-promise';

const endpoints = {
  embedly: 'https://api.embed.ly/1/oembed?',
};

const schemeWhitelist = [
  /500px.com/,
  /cl.ly/,
  /dailymotion.com\/video/,
  /(?:deviantart.com\/art|fav.me|sta.sh)/,
  /(?:dribbble.com\/shots|drbl.in)/,
  /d.pr\/i/,
  /(?:flic.kr|flickr.com)/,
  /ted.com\/talks/,
  /bandcamp.com/,
  /imgur.com/,
  /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/,
  /img.ly/,
  /moby.to/,
  /soundcloud.com/,
  /.(jpg|gif|png|jpeg)$/,
  /tumblr.com\/.+.(?:gif|png|jpg)$/,
  /youtu.be/,
  /vimeo.com\/[0-9]*$/,
  /yfrog.com/,
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

const ignoreUrl = (url) => schemeWhitelist.every((scheme) => !scheme.test(url));

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

module.exports = { ignoreUrl, thumbnailFor };
