import domify from 'domify';
import { fetch as fetchPage } from '../fetchPage.js';

export default function ($) {
  return {
    name: 'Bandcamp',
    setting: 'bandcamp',
    re: /bandcamp.com\/(?:album|track)/,
    default: true,
    callback: url => fetchPage(url).then(data => {
      if (data.currentTarget.status !== 200) {
        return null;
      }

      const el = domify(data.currentTarget.response);
      const thumbnail = el.querySelector('[property="twitter:image"]').content;
      const embedURL = el.querySelector('[property="twitter:player"]').content;
      const height = el.querySelector('[property="twitter:player:height"]').content;
      const width = el.querySelector('[property="twitter:player:width"]').content;

      if (!thumbnail || !embedURL) {
        return null;
      }

      return {
        type: 'audio',
        thumbnail_url: $.getSafeURL(thumbnail),
        html: `<iframe style="border: 0; width: ${width}px; height: ${height}px;" src="${embedURL}" seamless></iframe>`,
        url,
      };
    }),
  };
}
