export default function ($) {
  return {
    name: 'Instagram',
    setting: 'instagram',
    re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/,
    default: true,
    callback: url => {
      if (!url.endsWith('/')) {
        url += '/';
      }

      return fetch(`${$.getEnpointFor('instagram')}${url}`).then($.statusAndJson)
      .then(data => {
        if (data.html.includes('video')) {
          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(data.thumbnail_url),
            html: `<iframe src="${url}embed/" width="612" height="710" style="max-height: 710px !important;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`,
            url,
          };
        }

        return {
          type: 'image',
          thumbnail_url: $.getSafeURL(data.thumbnail_url),
          url: $.getSafeURL(data.thumbnail_url),
        };
      });
    },
  };
}
