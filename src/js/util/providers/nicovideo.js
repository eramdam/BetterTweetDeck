import convert from 'xml-js';

export default function($) {
  return {
    name: 'Nicovideo',
    setting: 'nicovideo_jp',
    re: /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?(?:sm|nm|so|\d{2})[^/?]+/,
    default: true,
    callback: (url) => {
      const match = /(?:nico.ms|nicovideo.jp)\/(?:\w+\/)?((?:sm|nm|so|\d{2})[^/?]+)/.exec(url);
      if (match === null) return undefined;
      const id = match[1];
      return fetch(`${$.getEnpointFor('nicovideo')}${id}`)
        .then($.statusAndText)
        .then((xml) => convert.xml2js(xml, { compact: true }))
        .then((json) => {
          if (json.nicovideo_thumb_response.thumb === undefined) {
            return undefined;
          }
          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(
              `${json.nicovideo_thumb_response.thumb.thumbnail_url._text}`
            ),
            html: `
              <iframe src="https://embed.nicovideo.jp/watch/${id}?jsapi=1&playerId=1&allowProgrammaticFullScreen=1"
               style="height: 100%" id="nicovideoPlayer-1" frameborder="0" allowfullscreen></iframe>
            `,
            url,
          };
        });
    },
  };
}
