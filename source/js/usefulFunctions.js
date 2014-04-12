String.prototype._contains = function(word) {
	return this.indexOf(word) != -1;
}

// @author James Padolsey
// @url http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).
 
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

String.prototype.toCodePoints= function() {
    chars = [];
    for (var i= 0; i<this.length; i++) {
        var c1= this.charCodeAt(i);
        if (c1>=0xD800 && c1<0xDC00 && i+1<this.length) {
            var c2= this.charCodeAt(i+1);
            if (c2>=0xDC00 && c2<0xE000) {
                chars.push((0x10000 + ((c1-0xD800)<<10) + (c2-0xDC00)).toString(16));
                i++;
                continue;
            }
        }
        chars.push(c1.toString(16));
    }
    return chars;
}

if (!String.fromCodePoint) {
    /*!
    * ES6 Unicode Shims 0.1
    * (c) 2012 Steven Levithan <http://slevithan.com/>
    * MIT License
    */
    String.fromCodePoint = function fromCodePoint () {
        var chars = [], point, offset, units, i;
        for (i = 0; i < arguments.length; ++i) {
            point = arguments[i];
            offset = point - 0x10000;
            units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
            chars.push(String.fromCharCode.apply(null, units));
        }
        return chars.join("");
    }
}

Array.prototype.remove = function(value) {
  var idx = this.indexOf(value);
  if (idx != -1) {
      return this.splice(idx, 1); // The second parameter is the number of elements to remove.
  }
  return false;
}

// Emojitify an element thanks to emojiToImage.js
function emojiInElement(el) {
	el.innerHTML = emoji.imageReplace(el.innerHTML);
	el.classList.add("emoji");
}

