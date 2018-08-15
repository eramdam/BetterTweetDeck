export default function ($) {
  return {
    name: 'MLTSHP',
    setting: 'mltshp',
    re: /mltshp.com\/p\/[^/]+/,
    default: true,
    callback: (url) => {
      const id = url.match(/mltshp.com\/p\/([^/]+)/)[1];
      return fetch(`${$.getEnpointFor('mltshp')}${id}`).then(imgUrl => ({
        type: 'image',
        thumbnail_url: imgUrl,
        url: imgUrl,
      }));
    },
  };
}

