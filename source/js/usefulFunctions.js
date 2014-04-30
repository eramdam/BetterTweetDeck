var _ajax = function(url, method, dataType, headers, onSuccess, onFailure) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onload = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                if(dataType == "json") {
                    onSuccess(JSON.parse(req.responseText));
                } else if(dataType == "xml") {
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(req.responseText,"application/xml");
                    onSuccess(xml);
                } else {
                    onSuccess(req.responseText);
                }
            } else {
                if(onFailure) {
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

function clickedOutsideElement(elemId) {
  var theElem = getEventTarget(window.event);
  while(theElem != null) {
    if(theElem.id == elemId)
      return false;
    theElem = theElem.offsetParent;
  }
  return true;
}

function getEventTarget(evt) {
  var targ = (evt.target) ? evt.target : evt.srcElement;
  if(targ != null) {
    if(targ.nodeType == 3)
      targ = targ.parentNode;
  }
  return targ;
}

// Emojitify an element thanks to emojiToImage.js
function emojiInElement(el) {
	el.innerHTML = emoji.imageReplace(el.innerHTML);
	el.classList.add("emoji");
}

function emojiAfterNodeInsertion(event) {
    var tweetText = event.target.querySelector("p.js-tweet-text");
    if(tweetText) {
        emojiInElement(tweetText);
    }
}


function buildingEmojiComposer(emojiSource) {
	if(!bodyClasses.contains('emoji-composer-added')) {
		var emojiComposerHTML = emojiSource;
        var emojiComposerButton = '<button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-bl padding-vm" tabindex="0" data-original-title="" id="emojiButton" title=""> <i class="icon btd-icon-smile"></i> <span class="label padding-ls">Emojis</span> </button>';
        document.querySelector(".js-add-image-button").insertAdjacentHTML("beforebegin", emojiComposerButton);
        var emojiHolder = document.createElement("span");
        emojiHolder.className = "js-emoji-holder";
        emojiHolder.innerHTML = emojiComposerHTML;
        document.querySelector(".js-add-emojis").insertAdjacentHTML("afterend", emojiHolder.outerHTML);
        document.querySelector(".js-add-emojis").addEventListener("click", function() {
            if(document.querySelector(".emoji-popover").style.display == "none") {
                document.querySelector(".emoji-popover").style.display = "block";
                document.querySelector(".emoji-popover").setAttribute("id","emojiOpened");
                
            } else {
                document.querySelector(".emoji-popover").style.display = "none";
                document.querySelector(".emoji-popover").setAttribute("id","");
            }
        });
        
        var catButtons = document.querySelectorAll(".category-chooser > a");
        for (var i = catButtons.length - 1; i >= 0; i--) {
            catButtons[i].addEventListener("click", function(e) {
                e.target.parentNode.querySelector(".active").classList.remove("active");
                e.target.classList.toggle("active");
                document.querySelector(".emoji-container > div.active").classList.toggle("active");
                document.querySelector("."+e.target.getAttribute("data-cat")).classList.toggle("active");
                return false;
            });
        };
        var emojisImg = document.querySelectorAll(".emoji-container > div > a");
        for (var i = emojisImg.length - 1; i >= 0; i--) {
            emojisImg[i].addEventListener("click", function(e) {
                document.querySelector("textarea.js-compose-text").value += e.target.getAttribute("data-string");
                document.querySelector("textarea.js-compose-text").dispatchEvent(new Event("change"));
                return false;
            });
        };
		bodyClasses.add("emoji-composer-added");
        document.onclick = function() {
          if(clickedOutsideElement('emojiOpened') && clickedOutsideElement("emojiButton") && document.getElementById("emojiOpened") != null){
            document.getElementById("emojiOpened").style.display = "none";
            document.getElementById("emojiOpened").setAttribute("id","");
          }
        };
	}
}

function findColumn(childObj) {
    var testObj = childObj.parentNode;
    var count = 1;
    while(testObj.classList && !testObj.classList.contains("js-column")) {
        testObj = testObj.parentNode;
        count++;
    }
    // now you have the object you are looking for - do something with it
    return testObj;
}

function getTDTheme() {
    var TDTheme = TD.settings.getTheme();

    if(TDTheme === "dark") {

        document.body.classList.remove("light-theme-activated");
        document.body.classList.add("dark-theme-activated");
    } else {
        document.body.classList.remove("dark-theme-activated");
        document.body.classList.add("light-theme-activated");
    }
}