export default function($) {
  return {
    name: "Tumblr",
    setting: "tumblr",
    re: /tumblr.com\/.+.(?:gif|png|jpg)$/,
    default: true,
    callback: url =>
      Promise.resolve({
        type: "image",
        thumbnail_url: $.getSafeURL(url),
        url: $.getSafeURL(url)
      })
  };
}
