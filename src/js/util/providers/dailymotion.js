import qs from 'query-string';
import { parseURL } from '../parseUrl.js';

export default function ($) {
  return {
    name: 'Dailymotion',
    setting: 'dailymotion',
    re: /dailymotion.com\/video/,
    default: true,
    callback: url => {
      const ID = parseURL(url).segments[1];

      return fetch(`${$.getEnpointFor('dailymotion')}/${ID}?${qs.stringify({
        fields: 'thumbnail_240_url,thumbnail_360_url,thumbnail_180_url,embed_html',
      })}`)
        .then($.statusAndJson)
        .then(data => {
          const obj = {
            type: 'video',
            thumbnail_url: $.getSafeURL(data.thumbnail_360_url),
            url,
            html: data.embed_html.replace('http://', 'https://'),
          };

          return obj;
        });
    },
  };
}
