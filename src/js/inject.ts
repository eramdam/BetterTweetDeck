import moduleRaid from 'moduleraid';

// @ts-ignore
const BTD_SETTINGS = JSON.parse(document.querySelector('[data-btd-settings]').dataset.btdSettings);
console.log(BTD_SETTINGS)

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

 // @ts-ignore
window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];