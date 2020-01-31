import { Client } from 'config';
import { shuffle } from 'lodash';
import qs from 'query-string';

const formatTenorResults = (res) =>
  res.results.map((result) => ({
    preview: {
      url: result.media[0].tinygif.url,
      width: result.media[0].tinygif.dims[0],
      height: result.media[0].tinygif.dims[1],
    },
    url: result.media[0].gif.url,
    source: 'tenor',
  }));

const formatGiphyResults = (res) =>
  res.data.map((i) => ({
    preview: i.images.preview_gif,
    url: i.images.original.url,
    source: 'giphy',
  }));

const tenor = (endpoint, params = {}) => {
  if (!endpoint) {
    throw new Error('specify a endpoint!');
  }

  const querystring = qs.stringify(
    Object.assign(
      {
        key: Client.APIs.tenor,
      },
      params
    )
  );

  return fetch(`https://api.tenor.com/v1/${endpoint}?${querystring}`).then((res) => res.json());
};

const giphy = (endpoint, params = {}) => {
  if (!endpoint) {
    throw new Error('specify a endpoint!');
  }

  const querystring = qs.stringify(
    Object.assign(
      {
        api_key: Client.APIs.giphy,
      },
      params
    )
  );

  return fetch(`https://api.giphy.com/v1/gifs/${endpoint}?${querystring}`).then((res) =>
    res.json()
  );
};

export function trending() {
  return Promise.all([tenor('trending', { limit: 10 }), giphy('trending', { limit: 10 })]).then(
    (values) => {
      const tenorResults = formatTenorResults(values[0]);
      const giphyResults = formatGiphyResults(values[1]);

      return shuffle([...tenorResults, ...giphyResults]);
    }
  );
}

export function search(query) {
  return Promise.all([
    tenor('search', { limit: 10, q: query }),
    giphy('search', { limit: 10, q: query }),
  ]).then((values) => {
    const tenorResults = formatTenorResults(values[0]);
    const giphyResults = formatGiphyResults(values[1]);

    return shuffle([...tenorResults, ...giphyResults]);
  });
}

export default function tenorR(endpoint, params = {}) {
  if (!endpoint) {
    throw new Error('specify a endpoint!');
  }

  const querystring = qs.stringify(
    Object.assign(
      {
        key: Client.APIs.tenor,
      },
      params
    )
  );

  return fetch(`https://api.tenor.com/v1/${endpoint}?${querystring}`).then((res) => res.json());
}
