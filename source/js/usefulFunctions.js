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

var populateEmojis = function(source, elName) {
    var emojis = source.split(",");
    var emojisToAdd = "";
    for (var i = 0; i < emojis.length; i++) {
        var codesPoints = emojis[i].toCodePoints();
        if(codesPoints.indexOf("fe0f") != -1) {
            codesPoints.remove("fe0f");
        }
        var tuple = codesPoints.join("-");
        emojisToAdd += '<a href="#" data-string="'+emojis[i]+'" class="emoji-pop twitter-emoji emojis-t-'+tuple+'"></a>';
    };
    document.querySelector(".emoji-popover .emojis-compose-panel .emoji-container ."+elName).innerHTML += emojisToAdd;
}

function buildingEmojiComposer() {
	if(!bodyClasses.contains('emoji-composer-added')) {
		var emojis = JSON.parse('{"EmojiDataArray":[{"CVDataTitle":"EmojiCategory-People","CVCategoryImage":"Emoji-HumanImage","CVCategoryData":{"CVSkipNullGlyphs":true,"Data":"😄,😃,😀,😊,☺️,😉,😍,😘,😚,😗,😙,😜,😝,😛,😳,😁,😔,😌,😒,😞,😣,😢,😂,😭,😪,😥,😰,😅,😓,😩,😫,😨,😱,😠,😡,😤,😖,😆,😋,😷,😎,😴,😵,😲,😟,😦,😧,😈,👿,😮,😬,😐,😕,😯,😶,😇,😏,😑,👲,👳,👮,👷,💂,👶,👦,👧,👨,👩,👴,👵,👱,👼,👸,😺,😸,😻,😽,😼,🙀,😿,😹,😾,👹,👺,🙈,🙉,🙊,💀,👽,💩,🔥,✨,🌟,💫,💥,💢,💦,💧,💤,💨,👂,👀,👃,👅,👄,👍,👎,👌,👊,✊,✌️,👋,✋,👐,👆,👇,👉,👈,🙌,🙏,☝️,👏,💪,🚶,🏃,💃,👫,👪,👬,👭,💏,💑,👯,🙆,🙅,💁,🙋,💆,💇,💅,👰,🙎,🙍,🙇,🎩,👑,👒,👟,👞,👡,👠,👢,👕,👔,👚,👗,🎽,👖,👘,👙,💼,👜,👝,👛,👓,🎀,🌂,💄,💛,💙,💜,💚,❤️,💔,💗,💓,💕,💖,💞,💘,💌,💋,💍,💎,👤,👥,💬,👣,💭"}},{"CVDataTitle":"EmojiCategory-Nature","CVCategoryImage":"Emoji-NatureImage","CVCategoryData":{"CVSkipNullGlyphs":true,"Data":"🐶,🐺,🐱,🐭,🐹,🐰,🐸,🐯,🐨,🐻,🐷,🐽,🐮,🐗,🐵,🐒,🐴,🐑,🐘,🐼,🐧,🐦,🐤,🐥,🐣,🐔,🐍,🐢,🐛,🐝,🐜,🐞,🐌,🐙,🐚,🐠,🐟,🐬,🐳,🐋,🐄,🐏,🐀,🐃,🐅,🐇,🐉,🐎,🐐,🐓,🐕,🐖,🐁,🐂,🐲,🐡,🐊,🐫,🐪,🐆,🐈,🐩,🐾,💐,🌸,🌷,🍀,🌹,🌻,🌺,🍁,🍃,🍂,🌿,🌾,🍄,🌵,🌴,🌲,🌳,🌰,🌱,🌼,🌐,🌞,🌝,🌚,🌑,🌒,🌓,🌔,🌕,🌖,🌗,🌘,🌜,🌛,🌙,🌍,🌎,🌏,🌋,🌌,🌠,⭐️,☀️,⛅️,☁️,⚡️,☔️,❄️,⛄️,🌀,🌁,🌈,🌊"}},{"CVDataTitle":"EmojiCategory-Objects","CVCategoryImage":"Emoji-ObjectsImage","CVCategoryData":{"CVSkipNullGlyphs":true,"Data":"🎍,💝,🎎,🎒,🎓,🎏,🎆,🎇,🎐,🎑,🎃,👻,🎅,🎄,🎁,🎋,🎉,🎊,🎈,🎌,🔮,🎥,📷,📹,📼,💿,📀,💽,💾,💻,📱,☎️,📞,📟,📠,📡,📺,📻,🔊,🔉,🔈,🔇,🔔,🔕,📢,📣,⏳,⌛️,⏰,⌚️,🔓,🔒,🔏,🔐,🔑,🔎,💡,🔦,🔆,🔅,🔌,🔋,🔍,🛁,🛀,🚿,🚽,🔧,🔩,🔨,🚪,🚬,💣,🔫,🔪,💊,💉,💰,💴,💵,💷,💶,💳,💸,📲,📧,📥,📤,✉️,📩,📨,📯,📫,📪,📬,📭,📮,📦,📝,📄,📃,📑,📊,📈,📉,📜,📋,📅,📆,📇,📁,📂,✂️,📌,📎,✒️,✏️,📏,📐,📕,📗,📘,📙,📓,📔,📒,📚,📖,🔖,📛,🔬,🔭,📰,🎨,🎬,🎤,🎧,🎼,🎵,🎶,🎹,🎻,🎺,🎷,🎸,👾,🎮,🃏,🎴,🀄️,🎲,🎯,🏈,🏀,⚽️,⚾️,🎾,🎱,🏉,🎳,⛳️,🚵,🚴,🏁,🏇,🏆,🎿,🏂,🏊,🏄,🎣,☕️,🍵,🍶,🍼,🍺,🍻,🍸,🍹,🍷,🍴,🍕,🍔,🍟,🍗,🍖,🍝,🍛,🍤,🍱,🍣,🍥,🍙,🍘,🍚,🍜,🍲,🍢,🍡,🍳,🍞,🍩,🍮,🍦,🍨,🍧,🎂,🍰,🍪,🍫,🍬,🍭,🍯,🍎,🍏,🍊,🍋,🍒,🍇,🍉,🍓,🍑,🍈,🍌,🍐,🍍,🍠,🍆,🍅,🌽"}},{"CVDataTitle":"EmojiCategory-Places","CVCategoryImage":"Emoji-PlacesImage","CVCategoryData":{"CVSkipNullGlyphs":true,"Data":"🏠,🏡,🏫,🏢,🏣,🏥,🏦,🏪,🏩,🏨,💒,⛪️,🏬,🏤,🌇,🌆,🏯,🏰,⛺️,🏭,🗼,🗾,🗻,🌄,🌅,🌃,🗽,🌉,🎠,🎡,⛲️,🎢,🚢,⛵️,🚤,🚣,⚓️,🚀,✈️,💺,🚁,🚂,🚊,🚉,🚞,🚆,🚄,🚅,🚈,🚇,🚝,🚋,🚃,🚎,🚌,🚍,🚙,🚘,🚗,🚕,🚖,🚛,🚚,🚨,🚓,🚔,🚒,🚑,🚐,🚲,🚡,🚟,🚠,🚜,💈,🚏,🎫,🚦,🚥,⚠️,🚧,🔰,⛽️,🏮,🎰,♨️,🗿,🎪,🎭,📍,🚩,🇯🇵,🇰🇷,🇩🇪,🇨🇳,🇺🇸,🇫🇷,🇪🇸,🇮🇹,🇷🇺,🇬🇧"}},{"CVDataTitle":"EmojiCategory-Symbols","CVCategoryImage":"Emoji-SymbolImage","CVCategoryData":{"CVSkipNullGlyphs":true,"Data":"1️⃣,2️⃣,3️⃣,4️⃣,5️⃣,6️⃣,7️⃣,8️⃣,9️⃣,0️⃣,🔟,🔢,#️⃣,🔣,⬆️,⬇️,⬅️,➡️,🔠,🔡,🔤,↗️,↖️,↘️,↙️,↔️,↕️,🔄,◀️,▶️,🔼,🔽,↩️,↪️,ℹ️,⏪,⏩,⏫,⏬,⤵️,⤴️,🆗,🔀,🔁,🔂,🆕,🆙,🆒,🆓,🆖,📶,🎦,🈁,🈯️,🈳,🈵,🈴,🈲,🉐,🈹,🈺,🈶,🈚️,🚻,🚹,🚺,🚼,🚾,🚰,🚮,🅿️,♿️,🚭,🈷,🈸,🈂,Ⓜ️,🛂,🛄,🛅,🛃,🉑,㊙️,㊗️,🆑,🆘,🆔,🚫,🔞,📵,🚯,🚱,🚳,🚷,🚸,⛔️,✳️,❇️,❎,✅,✴️,💟,🆚,📳,📴,🅰,🅱,🆎,🅾,💠,➿,♻️,♈️,♉️,♊️,♋️,♌️,♍️,♎️,♏️,♐️,♑️,♒️,♓️,⛎,🔯,🏧,💹,💲,💱,©,®,™,❌,‼️,⁉️,❗️,❓,❕,❔,⭕️,🔝,🔚,🔙,🔛,🔜,🔃,🕛,🕧,🕐,🕜,🕑,🕝,🕒,🕞,🕓,🕟,🕔,🕠,🕕,🕖,🕗,🕘,🕙,🕚,🕡,🕢,🕣,🕤,🕥,🕦,✖️,➕,➖,➗,♠️,♥️,♣️,♦️,💮,💯,✔️,☑️,🔘,🔗,➰,〰,〽️,🔱,◼️,◻️,◾️,◽️,▪️,▫️,🔺,🔲,🔳,⚫️,⚪️,🔴,🔵,🔻,⬜️,⬛️,🔶,🔷,🔸,🔹"}}]}');
		var emojiComposerHTML = '<div class="popover popover-position-t margin-ll emoji-popover" id="" style="display:none;"><div class="caret"><span class="caret-outer"></span><span class="caret-inner"></span></div><div class="emojis-compose-panel"><div class="emoji-container"><div class="Emoji-HumanImage active"></div><div class="Emoji-NatureImage"></div><div class="Emoji-ObjectsImage"></div><div class="Emoji-PlacesImage"></div><div class="Emoji-SymbolImage"></div></div><div class="category-chooser"><a data-cat="Emoji-HumanImage" href="#" class="twitter-emoji emoji-pop emojis-t-1f60d active"></a><a data-cat="Emoji-NatureImage" href="#" class="twitter-emoji emoji-pop emojis-t-1f340"></a><a data-cat="Emoji-ObjectsImage" href="#" class="twitter-emoji emoji-pop emojis-t-1f514"></a><a data-cat="Emoji-PlacesImage" href="#" class="twitter-emoji emoji-pop emojis-t-1f5ff"></a><a data-cat="Emoji-SymbolImage" href="#" class="twitter-emoji emoji-pop emojis-t-23-20e3"></a></div></div></div>';
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

        var datas = emojis.EmojiDataArray;
        for (var i = 0; i < datas.length; i++) {
            populateEmojis(datas[i].CVCategoryData.Data, datas[i].CVCategoryImage);
        };
        
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