import {makeBTDModule} from '../types/btdCommonTypes';

enum LABELS {
  SELECT_ALL = 'Select All',
  UNSELECT_ALL = 'Unselect All',
}

export const addUncheckAllToReplyToModal = makeBTDModule(({TD}) => {
  const jsModalsContainer = document.querySelector('.js-modals-container') as HTMLDivElement;
  /**
   * Listen to modal that are appended to the modal container
   *
   * Idea is to check if it's the right modal, since it doesn't appear to have a uuid or other consistant identifier
   */
  const observer = new MutationObserver((mutationsList, observer) => {
    if (mutationsList[0].addedNodes.length > 0) {
      const addedNode = mutationsList[0].addedNodes[0];
      const isReplyToModal =
        document.querySelector('.js-reply-checkbox') instanceof HTMLInputElement;

      if (isReplyToModal) {
        const containerForNewCheckbox =
          addedNode.childNodes[1].childNodes[5].childNodes[0].childNodes[1];

        const label = document.createElement('label');
        label.textContent = LABELS.UNSELECT_ALL;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        checkbox.addEventListener('change', (e) => {
          const selectAll = checkbox.checked;
          label.textContent = selectAll ? LABELS.UNSELECT_ALL : LABELS.SELECT_ALL;
          Array.from(
            document.querySelectorAll(
              '.js-reply-checkbox:not([disabled])'
            ) as NodeListOf<HTMLInputElement>
          ).forEach((input) => {
            if (selectAll)
              if (!input.checked) input.click();
              else if (input.checked) input.click();
          });
        });

        Object.assign(label.style, {
          cursor: 'pointer',
        });

        label.append(checkbox);
        containerForNewCheckbox.appendChild(label);
      }
    }
  });

  observer.observe(jsModalsContainer, {characterData: false, childList: true, attributes: false});
});
