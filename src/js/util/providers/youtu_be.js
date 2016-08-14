export default function ($) {
  return {
    name: 'Youtu.be',
    setting: 'youtu_be',
    re: /youtu.be/,
    default: true,
    callback: $.noEmbedVideoCB,
  };
}
