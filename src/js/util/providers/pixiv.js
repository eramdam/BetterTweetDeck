export default function ($) {
  return {
    name: 'Pixiv',
    setting: 'pixiv',
    re: /(?:pixiv.net\/member_illust.php|pixiv.net\/i\/)/,
    default: true,
    callback: (url) => {
      let illustId;
      if (url.includes('member_illust.php')) {
        const urlObject = new URL(url);
        illustId = urlObject.searchParams.get('illust_id');
      } else {
        illustId = url.slice(url.lastIndexOf('/') + 1);
      }
      return fetch($.getSafeURL(`${$.getEnpointFor('pixiv')}${illustId}`))
        .then(res => res.text())
        .then((res) => {
          const match = res.match(/callback\((.*)\)/);
          const data = JSON.parse(match[1]);
          return data;
        })
        .then((data) => {
          const thumbnailUrl = $.getSafeURL(data.img.replace('240x480', '600x600'));
          const imgUrl = $.getSafeURL(data.img.replace('240x480', '1200x1200'));
          return {
            type: 'image',
            thumbnail_url: thumbnailUrl,
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
