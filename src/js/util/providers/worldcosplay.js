import domify from 'domify';

export default function ($) {
  return {
    name: 'WorldCosplay',
    setting: 'worldcosplay_net',
    re: /worldcosplay.net/,
    default: true,
    callback: url => {
      url = url.replace(/m.(worldcosplay.net)/, '$1');
      const photoRegex = /worldcosplay.net\/(photo|instants|collections)\/(\d+)/;
      const match = photoRegex.exec(url);
      const type = match[1];
      return fetch($.getSafeURL(url))
        .then($.statusAndText)
        .then(html => {
          const doc = domify(html);
          let imgUrl;
          let thumbnailUrl;
          if (type === 'photo') {
            imgUrl = doc.querySelector('.photo img').src;
            thumbnailUrl = doc.querySelector('#photoPage').dataset.thumbnailUrl;
          } else if (type === 'instants') {
            imgUrl = doc.querySelector('img.photo').src;
            thumbnailUrl = imgUrl;
          } else if (type === 'collections') {
            imgUrl = doc.querySelector('.photo-collection').dataset.coverPhotoUrl;
            thumbnailUrl = imgUrl;
          } else {
            return undefined;
          }

          return Promise.resolve({
            type: 'image',
            thumbnail_url: $.getSafeURL(thumbnailUrl),
            url: $.getSafeURL(imgUrl),
          });
        });
    },
  };
}
