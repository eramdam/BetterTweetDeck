import parseURL from "../parseUrl";

export default function($) {
  return {
    name: "Gfycat",
    setting: "gfycat",
    re: /gfycat.com/,
    default: true,
    callback: url => {
      return fetch(`${$.getEnpointFor("gfycat")}${url}`)
        .then($.statusAndJson)
        .then(data => {
          let tbUrl = data.thumbnail_url;
          const ID = parseURL(url).segments[0];

          if (!data.thumbnail_url) {
            tbUrl = `https://thumbs.gfycat.com/${ID}-poster.jpg`;
          }

          const obj = {
            type: "video",
            thumbnail_url: $.getSafeURL(tbUrl),
            html: data.html,
            url
          };

          return obj;
        });
    }
  };
}
