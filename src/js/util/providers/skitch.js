export default function($) {
  return {
    name: "Skitch",
    setting: "skitch",
    re: /(?:skitch.com|img.skitch.com)/,
    default: true,
    callback: $.noEmbedImgCB
  };
}
