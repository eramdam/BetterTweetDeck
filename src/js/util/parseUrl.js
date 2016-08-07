// @author James Padolsey
// @url http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).

const getParams = (a) => {
  const ret = {};
  const seg = a.search.replace(/^\?/, '').split;
  const len = seg.length;
  let i = 0;
  let s;
  for (; i < len; i++) {
    if (!seg[i]) {
      continue;
    }
    s = seg[i].split('=');
    ret[s[0]] = s[1];
  }

  return ret;
};

export function parseURL(url) {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: () => getParams(a),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [undefined, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [undefined, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
}
