export default function ($) {
  return {
    name: 'twipple',
    setting: 'twipple_jp',
    re: /(?:p.twipple.jp|p.twpl.jp)/,
    default: true,
    callback: url => {
      const imageId = url.slice(url.lastIndexOf('/') + 1);
      return Promise.resolve({
        type: 'image',
        thumbnail_url: $.getSafeURL(`http://p.twipple.jp/show/large/${imageId}`),
        url: $.getSafeURL(`http://p.twipple.jp/show/orig/${imageId}`),
      });
    },
  };
}
