export default function ($) {
  return {
    name: 'Miil',
    setting: 'miil_me',
    re: /miil\.me\/p\/[a-zA-Z0-9]+$/,
    default: true,
    callback: url => Promise.resolve({
      type: 'image',
      thumbnail_url: $.getSafeURL($.getSafeURL(`${url}.jpeg`)),
      url: $.getSafeURL($.getSafeURL(`${url}.jpeg`)),
    }),
  };
}

