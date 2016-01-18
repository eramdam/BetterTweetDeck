import config from 'config';
import qs from 'query-string';

const endpoints = {
  'embedly': 'https://api.embed.ly/1/oembed?'
};

const schemeBlacklist = [
  /twitter\.com/,
  /vine\.co/,
  /youtube\.com/
];

const getEnpointFor = (service) => endpoints[service];

const status = (res) => {
  if (res.status >= 200 && res.status < 300)
    return Promise.resolve(res);

  return Promise.reject(new Error(res.statusText));
};

const json = res => {
  if (!res)
    return null;

  return res.json();
};

export const ignoreUrl = (url) => {
  return schemeBlacklist.some((scheme) => scheme.test(url));
};

export const thumbnailFor = (url) => {
  // console.log(`Fetching ${url}`);
  return fetch(`${getEnpointFor('embedly')}${qs.stringify({
    url,
    secure: true,
    scheme: 'https',
    key: config.get('Client.APIs.embedly')
  })}`)
    .then(status)
    .catch(() => null)
    .then(json);
};
