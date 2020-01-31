import parseURL from '../parseUrl';

export default function($) {
  return {
    name: 'Imgur',
    setting: 'imgur',
    re: /(?:imgur.com|i.imgur.com)/,
    default: true,
    callback: (url) => {
      const headers = new Headers();
      headers.append('Authorization', `Client-ID ${$.getKeyFor('imgur')}`);

      if (url.includes('imgur.com/a/')) {
        const imgurID = parseURL(url).segments[1];

        return fetch(`${$.getEnpointFor('imgur')}album/${imgurID}`, { headers })
          .then($.statusAndJson)
          .then((data) => {
            return {
              type: 'image',
              thumbnail_url: `https://i.imgur.com/${data.data.cover}l.jpg`,
              html: `<iframe class="imgur-album" frameborder="0" src="https://imgur.com/a/${imgurID}/embed?pub=true&width=560" style="width: 560px !important;" scrolling="no"></iframe>`,
              url: $.getSafeURL(url),
            };
          });
      } else if (url.includes('imgur.com/gallery')) {
        const imgurID = parseURL(url).segments[1];

        return fetch(`${$.getEnpointFor('imgur')}gallery/image/${imgurID}`, {
          headers,
        })
          .then($.statusAndJson)
          .then((data) => {
            let srcUrl;

            if (data.data.animated) {
              srcUrl = data.data.link;
              return {
                type: 'image',
                thumbnail_url: $.getSafeURL(data.data.link),
                html: `<iframe class="imgur-album" frameborder="0" src="https://imgur.com/${imgurID}/embed?pub=true&width=560" style="width: 560px !important;" scrolling="no"></iframe>`,
                url: $.getSafeURL(url),
              };
            }

            return {
              type: 'image',
              thumbnail_url: `https://i.imgur.com/${data.data.id}l.jpg`,
              url: srcUrl,
            };
          });
      }

      const imgurID = parseURL(url).segments[0].split('.')[0];

      return Promise.resolve({
        type: 'image',
        thumbnail_url: `https://i.imgur.com/${imgurID}l.jpg`,
        url: $.getSafeURL(`https://i.imgur.com/${imgurID}.jpg`),
      });
    },
  };
}
