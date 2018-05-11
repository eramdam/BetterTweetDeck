import qs from "query-string";

export default function($) {
  return {
    name: "DeviantArt",
    setting: "deviantart",
    re: /(?:deviantart.com\/art|fav.me|sta.sh)/,
    default: true,
    callback: url => {
      const sourceURL = url;
      return fetch(
        `${$.getEnpointFor("deviantart")}${qs.stringify({
          url: sourceURL
        })}`
      )
        .then($.statusAndJson)
        .then(data => {
          const obj = {
            type: "image",
            thumbnail_url: $.getSafeURL(data.thumbnail_url),
            url: $.getSafeURL(data.url)
          };

          return obj;
        });
    }
  };
}
