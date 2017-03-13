export default function ($) {
  return {
    name: 'Photozou',
    setting: 'photozou',
    re: /photozou.jp\/photo\/(?:show|photo_only|list)\/\d+\/\d+/,
    default: true,
    callback: url => {
      let requestUrl;
      const regex = /photozou.jp\/photo\/(show|photo_only|list)\/(\d+)\/(\d+)/;
      const type = regex.exec(url)[1];
      const userId = regex.exec(url)[2];
      const id = regex.exec(url)[3];

      if (type === 'show' || type === 'photo_only') {
        requestUrl = `${$.getEnpointFor('photozou')}photo_info.json?photo_id=${id}`;
      } else {
        requestUrl = `${$.getEnpointFor('photozou')}photo_list_public.json`
          + `?type=album&user_id=${userId}&album_id=${id}&limit=1`;
      }

      return fetch($.getSafeURL(requestUrl))
        .then($.statusAndJson)
        .then(json => {
          const photo = json.info.photo[0] || json.info.photo;
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(photo.image_url),
            url: $.getSafeURL(photo.original_image_url),
          };
        });
    },
  };
}
