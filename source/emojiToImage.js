//  (c) 2012 Mark Wunsch http://markwunsch.com
//  MIT license.

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
 
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.emoji = factory();
  }
}(this, function () {
  var emoji = {},
      EMOJI_HEX_TO_TUPLE;
 // Slightly tweaked to do simply emoji->hex for Twitter inclusion
 // hex list thanks to http://codepen.io/kejun/pen/Brvzi
  var EMOJI_HEX_TO_TUPLE = ['1f6c5','1f6c4','1f6c3','1f6c2','1f6c1','1f6c0','1f6bf','1f6be','1f6bd','1f6bc','1f6bb','1f6ba','1f6b9','1f6b8','1f6b7','1f6b6','1f6b5','1f6b4','1f6b3','1f6b2','1f6b1','1f6b0','1f6af','1f6ae','1f6ad','1f6ac','1f6ab','1f6aa','1f6a9','1f6a8','1f6a7','1f6a6','1f6a5','1f6a4','1f6a3','1f6a2','1f6a1','1f6a0','1f69f','1f69e','1f69d','1f69c','1f69b','1f69a','1f699','1f698','1f697','1f696','1f695','1f694','1f693','1f692','1f691','1f690','1f68f','1f68e','1f68d','1f68c','1f68b','1f68a','1f689','1f688','1f687','1f686','1f685','1f684','1f683','1f682','1f681','1f680','1f64f','1f64e','1f64d','1f64c','1f64b','1f64a','1f649','1f648','1f647','1f646','1f645','1f640','1f63f','1f63e','1f63d','1f63c','1f63b','1f63a','1f639','1f638','1f637','1f636','1f635','1f634','1f633','1f632','1f631','1f630','1f62f','1f62e','1f62d','1f62c','1f62b','1f62a','1f629','1f628','1f627','1f626','1f625','1f624','1f623','1f622','1f621','1f620','1f61f','1f61e','1f61d','1f61c','1f61b','1f61a','1f619','1f618','1f617','1f616','1f615','1f614','1f613','1f612','1f611','1f610','1f60f','1f60e','1f60d','1f60c','1f60b','1f60a','1f609','1f608','1f607','1f606','1f605','1f604','1f603','1f602','1f601','1f600','1f5ff','1f5fe','1f5fd','1f5fc','1f5fb','1f567','1f566','1f565','1f564','1f563','1f562','1f561','1f560','1f55f','1f55e','1f55d','1f55c','1f55b','1f55a','1f559','1f558','1f557','1f556','1f555','1f554','1f553','1f552','1f551','1f550','1f53d','1f53c','1f53b','1f53a','1f539','1f538','1f537','1f536','1f535','1f534','1f533','1f532','1f531','1f530','1f52f','1f52e','1f52d','1f52c','1f52b','1f52a','1f529','1f528','1f527','1f526','1f525','1f524','1f523','1f522','1f521','1f520','1f51f','1f51e','1f51d','1f51c','1f51b','1f51a','1f519','1f518','1f517','1f516','1f515','1f514','1f513','1f512','1f511','1f510','1f50f','1f50e','1f50d','1f50c','1f50b','1f50a','1f509','1f508','1f507','1f506','1f505','1f504','1f503','1f502','1f501','1f500','1f4fc','1f4fb','1f4fa','1f4f9','1f4f7','1f4f6','1f4f5','1f4f4','1f4f3','1f4f2','1f4f1','1f4f0','1f4ef','1f4ee','1f4ed','1f4ec','1f4eb','1f4ea','1f4e9','1f4e8','1f4e7','1f4e6','1f4e5','1f4e4','1f4e3','1f4e2','1f4e1','1f4e0','1f4df','1f4de','1f4dd','1f4dc','1f4db','1f4da','1f4d9','1f4d8','1f4d7','1f4d6','1f4d5','1f4d4','1f4d3','1f4d2','1f4d1','1f4d0','1f4cf','1f4ce','1f4cd','1f4cc','1f4cb','1f4ca','1f4c9','1f4c8','1f4c7','1f4c6','1f4c5','1f4c4','1f4c3','1f4c2','1f4c1','1f4c0','1f4bf','1f4be','1f4bd','1f4bc','1f4bb','1f4ba','1f4b9','1f4b8','1f4b7','1f4b6','1f4b5','1f4b4','1f4b3','1f4b2','1f4b1','1f4b0','1f4af','1f4ae','1f4ad','1f4ac','1f4ab','1f4aa','1f4a9','1f4a8','1f4a7','1f4a6','1f4a5','1f4a4','1f4a3','1f4a2','1f4a1','1f4a0','1f49f','1f49e','1f49d','1f49c','1f49b','1f49a','1f499','1f498','1f497','1f496','1f495','1f494','1f493','1f492','1f491','1f490','1f48f','1f48e','1f48d','1f48c','1f48b','1f48a','1f489','1f488','1f487','1f486','1f485','1f484','1f483','1f482','1f481','1f480','1f47f','1f47e','1f47d','1f47c','1f47b','1f47a','1f479','1f478','1f477','1f476','1f475','1f474','1f473','1f472','1f471','1f470','1f46f','1f46e','1f46d','1f46c','1f46b','1f46a','1f469','1f468','1f467','1f466','1f465','1f464','1f463','1f462','1f461','1f460','1f45f','1f45e','1f45d','1f45c','1f45b','1f45a','1f459','1f458','1f457','1f456','1f455','1f454','1f453','1f452','1f451','1f450','1f44f','1f44e','1f44d','1f44c','1f44b','1f44a','1f449','1f448','1f447','1f446','1f445','1f444','1f443','1f442','1f440','1f43e','1f43d','1f43c','1f43b','1f43a','1f439','1f438','1f437','1f436','1f435','1f434','1f433','1f432','1f431','1f430','1f42f','1f42e','1f42d','1f42c','1f42b','1f42a','1f429','1f428','1f427','1f426','1f425','1f424','1f423','1f422','1f421','1f420','1f41f','1f41e','1f41d','1f41c','1f41b','1f41a','1f419','1f418','1f417','1f416','1f415','1f414','1f413','1f412','1f411','1f410','1f40f','1f40e','1f40d','1f40c','1f40b','1f40a','1f409','1f408','1f407','1f406','1f405','1f404','1f403','1f402','1f401','1f400','1f3f0','1f3ef','1f3ee','1f3ed','1f3ec','1f3eb','1f3ea','1f3e9','1f3e8','1f3e7','1f3e6','1f3e5','1f3e4','1f3e3','1f3e2','1f3e1','1f3e0','1f3ca','1f3c9','1f3c8','1f3c7','1f3c6','1f3c4','1f3c3','1f3c2','1f3c1','1f3c0','1f3bf','1f3be','1f3bd','1f3bc','1f3bb','1f3ba','1f3b9','1f3b8','1f3b7','1f3b6','1f3b5','1f3b4','1f3b3','1f3b2','1f3b1','1f3b0','1f3af','1f3ae','1f3ad','1f3ac','1f3ab','1f3aa','1f3a9','1f3a8','1f3a7','1f3a6','1f3a5','1f3a4','1f3a3','1f3a2','1f3a1','1f3a0','1f393','1f392','1f391','1f390','1f38f','1f38e','1f38d','1f38c','1f38b','1f38a','1f389','1f388','1f387','1f386','1f385','1f384','1f383','1f382','1f381','1f380','1f37c','1f37b','1f37a','1f379','1f378','1f377','1f376','1f375','1f374','1f373','1f372','1f371','1f370','1f36f','1f36e','1f36d','1f36c','1f36b','1f36a','1f369','1f368','1f367','1f366','1f365','1f364','1f363','1f362','1f361','1f360','1f35f','1f35e','1f35d','1f35c','1f35b','1f35a','1f359','1f358','1f357','1f356','1f355','1f354','1f353','1f352','1f351','1f350','1f34f','1f34e','1f34d','1f34c','1f34b','1f34a','1f349','1f348','1f347','1f346','1f345','1f344','1f343','1f342','1f341','1f340','1f33f','1f33e','1f33d','1f33c','1f33b','1f33a','1f339','1f338','1f337','1f335','1f334','1f333','1f332','1f331','1f330','1f320','1f31f','1f31e','1f31d','1f31c','1f31b','1f31a','1f319','1f318','1f317','1f316','1f315','1f314','1f313','1f312','1f311','1f310','1f30f','1f30e','1f30d','1f30c','1f30b','1f30a','1f309','1f308','1f307','1f306','1f305','1f304','1f303','1f302','1f301','1f300'];
 
  var hexToEmoji = emoji.hexToEmoji = function (hex) {
    var codepoint = parseInt(hex, 16);
    return String.fromCodePoint(codepoint);
  }
 
  function emojiPatterns (hex) {
    return new RegExp(hexToEmoji(hex), "g");
  }
 
  function imageTagFromTuple (tupleNb) {
      return '<img src="https://abs.twimg.com/emoji/v1/72x72/'+tupleNb+'.png" class="twitter-emoji" />';
  }
 
  emoji.imageReplace = function replaceEmojiWithImage (input) {
    var buffer = input,
        tuple;
    for (var i = EMOJI_HEX_TO_TUPLE.length - 1; i >= 0; i--) {
      tuple = EMOJI_HEX_TO_TUPLE[i];
      buffer = buffer.replace(emojiPatterns(tuple), imageTagFromTuple(tuple));
    };
    return buffer;
  }
 
  return emoji;
}));