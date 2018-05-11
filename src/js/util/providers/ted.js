export default function($) {
  return {
    name: "TED",
    setting: "ted",
    re: /ted.com\/talks/,
    default: true,
    callback: $.noEmbedVideoCB
  };
}
