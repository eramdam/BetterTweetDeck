import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'WorldCosplay',
    setting: 'worldcosplay_net',
    re: /worldcosplay.net/,
    default: true,
    callback: (url) => {
      url = url.replace(/m.(worldcosplay.net)/, '$1');
      const photoRegex = /worldcosplay.net\/(photo|instants|collections)\/(\d+)/;
      const match = photoRegex.exec(url);
      const type = match[1];
      return fetch($.getSafeURL(url))
        .then($.statusAndText)
        .then((html) => {
          const doc = secureDomify.parse(html);
          let imgUrl;
          let thumbnailUrl;
          if (type === 'photo') {
            imgUrl = secureDomify.getAttributeFromNode(
              '.photo img',
              doc,
              'src',
            );
            thumbnailUrl = secureDomify.getAttributeFromNode(
              '#photoPage',
              doc,
              'data-thumbnail-url',
            );
          } else if (type === 'instants') {
            imgUrl = secureDomify.getAttributeFromNode('img.photo', doc, 'src');
            thumbnailUrl = imgUrl;
          } else if (type === 'collections') {
            imgUrl = secureDomify.getAttributeFromNode(
              '.photo-collection',
              doc,
              'data-cover-photo-url',
            );
            thumbnailUrl = imgUrl;
          } else {
            return undefined;
          }

          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(thumbnailUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
