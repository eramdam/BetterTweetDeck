import { parseURL } from '../parseUrl.js';
import fetchPage from '../fetchPage.js';
import domify from 'domify';

export default function ($) {
  return {
    name: 'Twitch',
    setting: 'twitch_tv',
    re: new RegExp('https?://(?:www.|)twitch.tv/*|twitch.tv/*/b/*'),
    default: true,
    callback: url => {
      /* eslint no-underscore-dangle: 0 */
      const parsed = parseURL(url);
      const channel = parsed.segments[0];

      const isBroadcast = parsed.segments[1] && ['v', 'b'].includes(parsed.segments[1]);
      const isClip = url.includes('clips.twitch.tv');

      if (isClip) {
        return fetchPage(url).then(data => {
          if (data.currentTarget.status !== 200) {
            return null;
          }

          const el = domify(data.currentTarget.response);
          const tbUrl = el.querySelector('[name="twitter:image"]').content;
          const embedURL = el.querySelector('[name="twitter:player"]').content;
          const height = el.querySelector('[name="twitter:player:height"]').content;
          const width = el.querySelector('[name="twitter:player:width"]').content;

          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(tbUrl),
            html: `<iframe src="${embedURL}" height="${height}" width="${width}" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`,
            url,
          };
        });
      }

      if (isBroadcast) {
        const broadcastId = parsed.segments[1] + parsed.segments[2];

        return fetch(`${$.getEnpointFor('twitch')}channels/${channel}/videos?broadcasts=true&client_id=${$.getKeyFor('twitch')}`).then($.statusAndJson)
        .then(data => {
          const finalVideo = data.videos.find(video => video._id === broadcastId);

          if (!finalVideo) {
            return null;
          }

          return {
            type: 'video',
            thumbnail_url: $.getSafeURL(finalVideo.thumbnails[0].url),
            html: `<iframe src="https://player.twitch.tv/?video=${broadcastId}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`,
            url,
          };
        });
      }

      return fetch(`${$.getEnpointFor('twitch')}channels/${channel}?client_id=${$.getKeyFor('twitch')}`).then($.statusAndJson)
      .then(data => {
        return {
          type: 'video',
          thumbnail_url: $.getSafeURL(data.profile_banner || data.video_banner || data.logo),
          html: `<iframe src="https://player.twitch.tv/?channel=${channel}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`,
          url,
        };
      });
    },
  };
}
