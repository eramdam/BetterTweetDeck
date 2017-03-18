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
        // Instagram didn't update their API yet to take accout of posts with multiple medias
        // so the `thumbnail_url` can give us an empty grey image in those cases.
        // That's why we want to detect that and use the /media endpoint instead as a fallback
        const needNewThumbnail = data.thumbnail_url.includes('null.');

        if (data.type === 'rich') {
          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(needNewThumbnail ? `${url}media/?size=t` : data.thumbnail_url),
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
