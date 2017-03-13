import convert from 'xml-js';

export default function ($) {
  return {
    name: 'Google+',
    setting: 'plus.google',
    re: /plus.google.com\/(?:u\/\d+\/)?photos\//,
    default: true,
    callback: url => {
      let type;
      let requestUrl;
      const photoRegex = /plus.google.com\/(?:u\/\d+\/)?photos\/(?:(\d+)\/albums?\/\d+\/(\d+)|(\d+)\/photo\/(\d+)|photo\/(\d+)\/(\d+))/;
      const albumRegex = /plus.google.com\/(?:u\/\d+\/)?photos\/(\d+)\/albums?\/(\d+)/;

      if (photoRegex.test(url)) {
        type = 'photo';
        const match = photoRegex.exec(url);
        const userId = match[1] || match[3] || match[5];
        const photoId = match[2] || match[4] || match[6];
        requestUrl = `${$.getEnpointFor('googleplus')}user/${userId}/photoid/${photoId}`;
      } else if (albumRegex.test(url)) {
        type = 'album';
        const match = albumRegex.exec(url);
        const userId = match[1];
        const albumId = match[2];
        requestUrl = `${$.getEnpointFor('googleplus')}user/${userId}/albumid/${albumId}`;
      } else {
        return undefined;
      }

      return fetch($.getSafeURL(requestUrl))
        .then($.statusAndText)
        .then(xml => convert.xml2js(xml, { compact: true }))
        .then(json => {
          let thumbnailUrl;
          if (type === 'photo') {
            const media = json.feed['media:group']['media:content'][0] || json.feed['media:group']['media:content'];
            thumbnailUrl = media._attributes.url;
          } else {
            thumbnailUrl = json.feed.entry[0]['media:group']['media:content']._attributes.url;
          }
          const imgUrl = thumbnailUrl.replace(/[^/]+$/, 's1152/$&');
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(thumbnailUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
