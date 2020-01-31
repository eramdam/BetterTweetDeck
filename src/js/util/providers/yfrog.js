export default function($) {
  return {
    name: 'yfrog',
    setting: 'yfrog',
    re: /yfrog.com/,
    default: true,
    callback: $.noEmbedImgCB,
  };
}
