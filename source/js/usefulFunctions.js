var _ajax = function(url, method, dataType, headers, onSuccess, onFailure) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onload = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                if (dataType == "json") {
                    onSuccess(JSON.parse(req.responseText));
                } else if (dataType == "xml") {
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(req.responseText, "application/xml");
                    onSuccess(xml);
                } else {
                    onSuccess(req.responseText);
                }
            } else {
                if (onFailure) {
                    onFailure(req.statusText);
                }
            }
        }
    }
    if (headers) {
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                req.setRequestHeader(key, headers[key]);
            }
        }
    }
    req.send(null);
}

// @author James Padolsey
// @url http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function clickedOutsideElement(elemId) {
    var theElem = getEventTarget(window.event);
    while (theElem != null) {
        if (theElem.id == elemId)
            return false;
        theElem = theElem.offsetParent;
    }
    return true;
}

function getEventTarget(evt) {
    var targ = (evt.target) ? evt.target : evt.srcElement;
    if (targ != null) {
        if (targ.nodeType == 3)
            targ = targ.parentNode;
    }
    return targ;
}

String.prototype._contains = function(word) {
    return this.indexOf(word) != -1;
}

// http://stackoverflow.com/questions/23779076/how-to-prevent-parentnode-madness
function findParent(source,filter,root) {
    root = root || document.documentElement;
    while(source != root) {
        if( filter(source)) return source;
        source = source.parentNode;
    }
}

function filterColumn(e) {
    return e.attributes && e.attributes['data-media-preview-size'];
}

function CloseOpenModal(event, override) {
    if (override) {
        document.querySelector('#open-modal').style.display = "none";
        document.querySelector('#open-modal > *').remove();
    } else if (event.target.tagName === "DIV" || event.keyCode == 27) {
        if (document.querySelector('#open-modal .btd-modal')) {
            document.querySelector('#open-modal').style.display = "none";
            document.querySelector('#open-modal > *').remove();
        } else if (document.querySelector('a.mdl-dismiss')) {
            document.querySelector('a.mdl-dismiss').click();
        }
    } 
}

function ResizeMediaInModal() {
    if (document.querySelector('#open-modal')) {
        var mediaToResize = document.querySelector('#open-modal :-webkit-any(img, iframe, video)')
        mediaToResize.style.maxHeight = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - 20+"px";
    }
}