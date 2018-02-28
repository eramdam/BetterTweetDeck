export default function ($) {
  return {
    name: 'CorkBoard',
    setting: 'i.ppn_pw',
    re: /i.ppn.pw\/\w+/,
    default: true,
    callback: (url) => {
      const id = /\w+$/.exec(url);
      if (id === null) return undefined;

      return fetch(`${$.getEnpointFor('corkboard')}${id}`)
        .then($.statusAndText)
        .then((json) => {
          json = JSON.parse(json);
          if (json.status !== 'OK') return undefined;

          const contentUrl = $.getSafeURL(`https://storage.ppn.pw/cc/img/${json.user}/${json.src}`);
          const thumbnailUrl = $.getSafeURL(`https://storage.ppn.pw/cc/thumb/${json.thumbnail}`);

          switch (json.type) {
            case '0':
              return {
                type: 'image',
                thumbnail_url: thumbnailUrl,
                url: contentUrl,
              };
            default:
              return undefined;
          }
        });
    },
  };
}

