export default function ($) {
  return {
    name: 'Instagram',
    setting: 'instagram',
    re: /https?:\/\/(?:i.|www.|)instagr(?:.am|am.com)\/p\/.+/,
    default: true,
    callback: (url) => {
      if (!url.endsWith('/')) {
        url += '/';
      }

      return fetch(`${$.getEnpointFor('instagram')}${url}`)
        .then($.statusAndJson)
        .then((data) => {
          // Instagram didn't update their API yet to take account of posts with multiple medias
          // so the `thumbnail_url` can give us an empty grey image in those cases.
          // That's why we want to detect that and use the /media endpoint instead as a fallback
          const needNewThumbnail = data.thumbnail_url.includes('null.');

          if (data.type === 'rich') {
            return {
              type: 'video',
              thumbnail_url: $.getSafeURL(needNewThumbnail ? `${url}media/?size=t` : data.thumbnail_url),
              html: `
              <div style="width: 100%; flex: 1; display: flex; align-items: center; justify-content: center;">
                <div style="max-width: 450px; flex: 1; max-height: 100%;" btd-instagram-embed>
                  ${data.html}
                </div>
              </div>
            `,
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
