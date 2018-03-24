import fetchPage from '../fetchPage';
import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'Bandcamp',
    setting: 'bandcamp',
    re: /bandcamp.com\/(?:album|track)/,
    default: true,
    callback: url =>
      fetchPage(url).then((data) => {
        if (data.target.status !== 200) {
          return null;
        }

        const el = secureDomify.parse(data.target.response);
        let thumbnail = secureDomify.getAttributeFromNode(
          '[property="og:image"]',
          el,
          'content',
        );

        if (!thumbnail) {
          thumbnail = secureDomify.getAttributeFromNode(
            '[property="twitter:image"]',
            el,
            'content',
          );
        }

        const embedURL = secureDomify.getAttributeFromNode(
          '[property="twitter:player"]',
          el,
          'content',
        );
        const height = secureDomify.getAttributeFromNode(
          '[property="twitter:player:height"]',
          el,
          'content',
        );
        const width = secureDomify.getAttributeFromNode(
          '[property="twitter:player:width"]',
          el,
          'content',
        );

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
