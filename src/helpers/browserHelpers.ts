export const isFirefox = navigator.userAgent.includes('Firefox/');
export const isChrome = navigator.userAgent.includes('Chrome/');
export const isSafari = navigator.userAgent.includes('Safari/') && !isChrome;
