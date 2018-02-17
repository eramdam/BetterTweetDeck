const keepHashtags = () => {
  const tweetTextArea = document.querySelector('textarea.js-compose-text');
  let hashtags = [];
  const tweetObserver = new MutationObserver(() => {
    if (tweetTextArea.disabled) {
      hashtags = [];
      const tweetedHashtags = tweetTextArea.value.match(/[\s][#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー_]+/g);
      if (tweetedHashtags) {
        for (let i = 0; i < tweetedHashtags.length; i += 1) {
          tweetedHashtags[i] = tweetedHashtags[i].substr(1);
        }
        hashtags = tweetedHashtags;
      }
    } else {
      if (hashtags.length !== 0) {
        tweetTextArea.value = ` ${hashtags.join(' ')}`;
      }
      tweetTextArea.selectionStart = 0;
      tweetTextArea.selectionEnd = 0;
      tweetTextArea.dispatchEvent(new Event('change'));
    }
  });
  tweetObserver.observe(tweetTextArea, {
    attributes: true,
    attributeFilter: ['disabled'],
  });
};
export default keepHashtags;
