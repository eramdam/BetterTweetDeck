import { BTDComponent } from '../util/btdClass';

export class BTDUtils extends BTDComponent {
  getChirpFromKey = (key, colKey) => {
    const column = this.TD.controller.columnManager.get(colKey);

    if (!column) {
      return null;
    }

    const chirpsArray = [];
    Object.keys(column.updateIndex).forEach((updateKey) => {
      const c = column.updateIndex[updateKey];
      if (c) {
        chirpsArray.push(c);
      }

      if (c && c.retweetedStatus) {
        chirpsArray.push(c.retweetedStatus);
      }

      if (c && c.quotedTweet) {
        chirpsArray.push(c.quotedTweet);
      }

      if (c && c.messages) {
        chirpsArray.push(...c.messages);
      }

      if (c && c.targetTweet) {
        chirpsArray.push(c.targetTweet);
      }
    });

    if (column.detailViewComponent) {
      if (column.detailViewComponent.chirp) {
        chirpsArray.push(column.detailViewComponent.chirp);
      }

      if (column.detailViewComponent.mainChirp) {
        chirpsArray.push(column.detailViewComponent.mainChirp);
      }

      if (
        column.detailViewComponent.repliesTo &&
      column.detailViewComponent.repliesTo.repliesTo
      ) {
        chirpsArray.push(...column.detailViewComponent.repliesTo.repliesTo);
      }

      if (
        column.detailViewComponent.replies &&
      column.detailViewComponent.replies.replies
      ) {
        chirpsArray.push(...column.detailViewComponent.replies.replies);
      }
    }

    const chirp = chirpsArray.find(c => c.id === String(key));

    if (!chirp) {
      console.log(`did not find chirp ${key} within ${colKey}`);
      return null;
    }

    return chirp;
  };
  /**
 * Takes a node and fetches the chirp associated with it (useful for debugging)
 */
getChirpFromElement = (element) => {
  const chirpElm = element.closest('[data-key]');
  if (!chirpElm) {
    throw new Error('Not a chirp');
  }

  const chirpKey = chirpElm.getAttribute('data-key');

  let col = chirpElm.closest('[data-column]');
  if (!col) {
    col = document.querySelector(`[data-column] [data-key="${chirpKey}"]`);
    if (!col || !col.parentNode) {
      throw new Error('Chirp has no column');
    } else {
      col = col.parentNode;
    }
  }

  const colKey = col.getAttribute('data-column');
  const chirp = this.getChirpFromKey(chirpKey, colKey);
  chirp._btd = {
    chirpKey,
    columnKey: colKey,
  };
  return chirp;
};

findMustache = content => Object.keys(this.TD.mustaches)
  .filter(i => this.TD.mustaches[i].toLowerCase().includes(content.toLowerCase()))

attach() {
  window.BTD = {
    debug: {
      getChirpFromElement: this.getChirpFromElement,
      getChirpFromKey: this.getChirpFromKey,
      findMustache: this.findMustache,
    },
  };
}
}
