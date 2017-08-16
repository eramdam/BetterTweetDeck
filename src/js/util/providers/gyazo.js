import * as secureDomify from '../secureDomify';
import fetchPage from '../fetchPage';

export default function ($) {
  return {
    name: 'Gyazo',
    setting: 'gyazo',
    re: /gyazo.com/,
    default: true,
    callback: (url) => {
      let gyazoData = {};

      return fetch($.getSafeURL(`${$.getEnpointFor('gyazo')}${url}`))
        .then($.statusAndJson)
        .then((data) => {
          if (data.type === 'photo') {
            return {
              type: 'image',
              thumbnail_url: $.getSafeURL(data.url),
              url: $.getSafeURL(data.url),
            };
          }

          gyazoData = data;
          return fetchPage(url);
        })
        .then((data) => {
          if (data.type === 'image') {
            return data;
          }

          if (data.target.status !== 200) {
            return null;
          }

          const el = secureDomify.parse(data.target.response);
          const thumbnail = secureDomify.getAttributeFromNode('[name="twitter:image"]', el, 'content');

          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(thumbnail),
            html: gyazoData.html,
            url,
          };
        });
    },
  };
}
