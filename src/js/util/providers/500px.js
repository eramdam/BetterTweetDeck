export default function($) {
  return {
    name: "500px",
    setting: "500px",
    re: /500px.com/,
    default: true,
    callback: url => {
      return fetch(`${$.getEnpointFor("500px")}${url}`)
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
