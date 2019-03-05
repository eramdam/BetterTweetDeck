function keepHashtags() {
  const tweetTextArea = document.querySelector('textarea.js-compose-text');

  if (!tweetTextArea) {
    setTimeout(() => keepHashtags(), 1000);
    return;
  }

  let hashtags = [];
  const tweetObserver = new MutationObserver(() => {
    if (tweetTextArea.disabled) {
      const tweetText = tweetTextArea.value;
      const tweetedHashtags = window.twttrTxt.extractHashtags(tweetText);
      hashtags = tweetedHashtags;
    } else {
      if (hashtags.length !== 0) {
        tweetTextArea.value = ` ${hashtags.map(t => `#${t}`).join(' ')}`;
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
}
export default keepHashtags;
