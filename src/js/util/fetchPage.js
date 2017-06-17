export default function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}
