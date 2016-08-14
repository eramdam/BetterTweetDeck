export default function ($) {
  return {
    name: 'Universal',
    setting: 'universal',
    re: /.(jpg|gif|png|jpeg)$/,
    default: true,
    callback: url => Promise.resolve({
      type: 'image',
      thumbnail_url: $.getSafeURL(url),
      url: $.getSafeURL(url),
    }),
  };
}
