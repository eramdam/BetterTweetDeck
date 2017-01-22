import convert from 'xml-js';

export default function ($) {
  return {
    name: 'TINAMI',
    setting: 'tinami',
    re: /(?:www.tinami.com\/view|tinami.jp\/)/,
    default: true,
    callback: url => {
      let imageId = new URL(url).pathname.split('/').pop();
      // If short url, encode ID with base 36
      if (url.includes('tinami.jp')) {
        imageId = parseInt(imageId, 36);
      }
      return fetch($.getSafeURL(
        `${$.getEnpointFor('tinami')}cont_id=${imageId}&api_key=${$.getKeyFor('tinami')}`))
        .then($.statusAndText)
        .then(xml => convert.xml2js(xml, {compact: true}))
        .then(json => {
          // Quit if there is non-public image or no image
          if (json.rsp._attributes.stat !== 'ok' ||
              json.rsp.content._attributes.type == 'novel') {
            return;
          }
          const image = json.rsp.content.image ||
                json.rsp.content.images.image[0] ||
                json.rsp.content.images.image;
          const imgUrl = $.getSafeURL(image.url._text.replace(
            'http://api.tinami.com/', 'https://www.tinami.com/api/'));
          return Promise.resolve({
            type: 'image',
            thumbnail_url: imgUrl,
            url: imgUrl,
          });
        });
    },
  };
}
