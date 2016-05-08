import { send as sendMessage } from './messaging';
import { $ } from './util';

let nameFormat;

sendMessage({ action: 'get', key: 'nm_disp' }, (response) => {
  nameFormat = response.val;
});

function removeElMatchingSel(sel, node) {
  if (!$(sel, node) || !sel) {
    return;
  }

  $(sel, node)[0].remove();
}

function rewriteElMatchingsel(sel, node, html) {
  if (!$(sel, node) || !sel) {
    return;
  }

  $(sel, node)[0].innerHTML = html;
}

export function format({ node, user, fSel, uSel }) {
  switch (nameFormat) {
    default:
      break;

    case 'fullname':
      removeElMatchingSel(uSel, node);
      rewriteElMatchingsel(fSel, node, user.name);
      break;

    case 'username':
      removeElMatchingSel(uSel, node);
      rewriteElMatchingsel(fSel, node, user.screenName);
      break;

    case 'inverted':
      rewriteElMatchingsel(fSel, node, user.screenName);
      rewriteElMatchingsel(uSel, node, user.name);
      break;
  }
}

export function formatGroupDM({ node, participants, fSel }) {
  switch (nameFormat) {
    default:
      break;

    case 'inverted':
    case 'username':
      $(fSel, node).forEach((el, i) => {
        el.innerHTML = participants[i].screenName;
      });
      break;
  }
}
