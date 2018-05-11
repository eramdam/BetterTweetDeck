export default function($) {
  return {
    name: "Miil",
    setting: "miil_me",
    re: /miil\.me\/p\/[a-zA-Z0-9]+$/,
    default: true,
    callback: url => {
      const imgUrl = $.getSafeURL(`${url.replace("https://", "http://")}.jpeg`);
      return Promise.resolve({
        type: "image",
        thumbnail_url: imgUrl,
        url: imgUrl
      });
    }
  };
}
