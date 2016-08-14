export default function ($) {
  return {
    name: 'Droplr',
    setting: 'droplr',
    re: /d.pr\/i/,
    default: true,
    callback: url => {
      const dpUrl = $.getSafeURL(`${url.replace(/\/$/, '')}/medium`);

      return Promise.resolve({
        type: 'image',
        thumbnail_url: dpUrl,
        url: dpUrl,
      });
    },
  };
}
