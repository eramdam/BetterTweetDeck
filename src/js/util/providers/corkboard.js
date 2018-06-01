export default function ($) {
  return {
    name: 'CorkBoard',
    setting: 'i.ppn_pw',
    re: /i.ppn.pw\/\w+/,
    default: true,
    callback: (url) => {
      const id = /\w+$/.exec(url);
      if (id === null) {
        return undefined;
      }

      return fetch(`${$.getEnpointFor('corkboard')}${id}`)
        .then($.statusAndText)
        .then((json) => {
          json = JSON.parse(json);
          if (json.id === null) {
            return undefined;
          }

          const contentUrl = $.getSafeURL(`https://storage.arkjp.net/cc/img/${json.uid}/${json.img}`);
          const thumbnailUrl = $.getSafeURL(`https://storage.arkjp.net/cc/thumb/${json.thum}`);

          switch (json.video) {
            case 0:
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
