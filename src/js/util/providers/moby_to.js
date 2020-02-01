export default function($) {
  return {
    name: 'moby.to',
    setting: 'moby_to',
    re: /moby.to/,
    default: true,
    callback: $.noEmbedImgCB,
  };
}
