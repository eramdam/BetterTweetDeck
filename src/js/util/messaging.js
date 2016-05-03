// Very simply wrapper to send messages to background page easily
export function send(message, cb) {
  return chrome.runtime.sendMessage(message, cb);
}

export function on(cb) {
  return chrome.runtime.onMessage.addListener(cb);
}
