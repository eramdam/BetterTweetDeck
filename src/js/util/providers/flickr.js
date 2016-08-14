export default function ($) {
  return {
    name: 'Flickr',
    setting: 'flickr',
    re: /(?:flic.kr|flickr.com)/,
    default: true,
    callback: $.noEmbedImgCB,
  };
}
