import { getExtensionUrl, settings } from './util/browserHelpers';

settings.get().then((data) => {
  console.log({ data });
  const injected = document.createElement('script');
  injected.src = getExtensionUrl('js/inject.js');

  injected.dataset.btdSettings = JSON.stringify(data);

  document.head.appendChild(injected);
});
