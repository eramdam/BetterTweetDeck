export default function($) {
  return {
    name: 'Vimeo',
    setting: 'vimeo',
    re: /vimeo.com\/[0-9]*$/,
    default: true,
    callback: $.noEmbedVideoCB,
  };
}
