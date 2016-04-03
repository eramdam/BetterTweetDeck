// Very simply wrapper to send messages to background page easily
export default (message, cb) => {
  chrome.runtime.sendMessage(message, cb);
};
