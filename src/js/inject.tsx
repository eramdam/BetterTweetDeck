/* global TD */
import moduleRaid from 'moduleraid';

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

// @ts-ignore
window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

console.log({jQuery: $});
