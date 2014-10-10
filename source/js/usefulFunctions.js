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

// Shout out to https://github.com/github/time-elements/blob/master/time-elements.js
function pad(number) {
    return ('0' + number).slice(-2);
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

Array.prototype.randomElement = function () {
    var id = Math.floor(Math.random() * this.length); 
    if (this.last_random_id == id) { 
        return this.randomElement(); 
    } else { 
        this.last_random_id = id;
        return this[id];
    }
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
        mediaToResize.style.maxHeight = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - (document.querySelector("#open-modal .js-med-tweet.med-tweet").offsetHeight) - 20+"px";
    }
}

/* Psst, this is the code for the easter egg. But who would spoil such a thing ?
What ? You're still there ? Okay fine, you can look at that. You spoiled kid.
*/
function konamiTweets() {
    var tpl = Handlebars.compile(templates.konami_tweet);

    _ajax("http://erambert.me/others/konamibtd/tweet.json?v="+Math.random(),"GET","json",null, function(data) {
        var tweet = data.tweets.randomElement();
        var usernameTarget = document.querySelector(".js-app-columns :-webkit-any(.column-type-interactions, .column-type-mention) h1 .attribution").innerHTML.replace("@","");
        console.log(usernameTarget);
        var dataKonamiTweet = {
            "picture": tweet.picture,
            "fullname": tweet.fullname,
            "username": tweet.username,
            "text": tweet.text,
            "data-time": new Date(tweet.timestamp).getTime(),
            "timestamp": tweet.timestamp,
            "at": new Handlebars.SafeString('<a href="https://twitter.com/'+usernameTarget+'/" rel="user" data-user-name="'+usernameTarget+'" class="link-complex" target="_blank"><span>@</span><span class="link-complex-target">'+usernameTarget+'</span></a>')
        };
        var tweetMarkup = tpl(dataKonamiTweet);
        var tweetMarkup = tweetMarkup.replace("{{ at }}", dataKonamiTweet.at);
        document.querySelector(".js-app-columns :-webkit-any(.column-type-interactions, .column-type-mention) .js-chirp-container").insertAdjacentHTML("afterbegin", tweetMarkup);
    });
}

function shareBTD(request) {
    if (!document.body.classList.contains("btd-ready")) {
        readyShareTD.observe(document.querySelector(".js-app-loading"), {
            attributes: true
        });
    } else {
        console.debug(request);
        document.dispatchEvent(new CustomEvent('uiComposeTweet'));
        document.querySelector('textarea.js-compose-text').value = request.text + ' ' + request.url;
        document.querySelector('textarea.js-compose-text').dispatchEvent(new Event('change'));
    }
}


// From http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
function insertAtCaret(el,text) {
    var txtarea = el;
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}