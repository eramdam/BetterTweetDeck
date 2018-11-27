export default function ($) {
  return {
    name: 'MLTSHP',
    setting: 'mltshp',
    re: /mltshp.com\/p\/[^/]+/,
    default: true,
    callback: (url) => {
      const id = url.match(/mltshp.com\/p\/([^/]+)/)[1];
      const imgUrl = $.getSafeURL(`${$.getEnpointFor('mltshp')}${id}`);
      return Promise.resolve({
        type: 'image',
        thumbnail_url: imgUrl,
        url: imgUrl,
      });
    },
  };
}
