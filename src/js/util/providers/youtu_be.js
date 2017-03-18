export default function ($) {
  return {
    name: 'Youtube',
    setting: 'youtu_be',
    re: /youtu.be/,
    default: true,
    callback: $.noEmbedVideoCB,
  };
}
