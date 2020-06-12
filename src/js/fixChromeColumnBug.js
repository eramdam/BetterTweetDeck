export function maybeToggleColumnStyles() {
  const chromeVersionMatch = window.navigator.userAgent.match(/Chrome\/([0-9.]+) /);

  if (!chromeVersionMatch) {
    return;
  }

  const chromeVersionString = chromeVersionMatch[1].trim();

  if (!chromeVersionString) {
    return;
  }

  const [majorVersion, , patchVersion] = chromeVersionString.split('.').map((n) => Number(n));

  // The fix shipped in Chromium 85.0.4170.0
  // https://twitter.com/bfgeek/status/1271227206878912512
  if (majorVersion > 85 || (majorVersion === 85 && patchVersion >= 4170)) {
    return;
  }

  const columnObserver = new MutationObserver((mutations) => {
    if (mutations.length < 1) {
      return;
    }

    mutations.forEach((mutation) => {
      if (mutation.type !== 'attributes') {
        return;
      }

      const currentValue = String(mutation.target.getAttribute('class'));

      if (!currentValue.includes('js-column')) {
        return;
      }

      const oldValue = mutation.oldValue;

      if (!oldValue) {
        return;
      }

      if (!currentValue.includes('is-shifted-') && oldValue.includes('is-shifted-')) {
        setTimeout(() => {
          const columns = document.querySelectorAll('.js-column.will-animate');

          columns.forEach((col) => {
            col.classList.toggle('will-animate');
            setTimeout(() => {
              col.classList.toggle('will-animate');
            }, 1);
          });
        }, 500);
      }
    });
  });
  columnObserver.observe(document.querySelector('.js-app-columns'), {
    attributeFilter: ['class'],
    attributeOldValue: true,
    subtree: true,
  });
}
