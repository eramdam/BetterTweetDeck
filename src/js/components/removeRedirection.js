import { BTDComponent } from '../util/btdClass';

export class RemoveRedirection extends BTDComponent {
  init() {
    const dummyEl = document.createElement('span');
    const OGCreateUrlAnchor = this.TD.util.createUrlAnchor;

    this.TD.util.createUrlAnchor = (e) => {
      // We run the url through the original function first
      let result = OGCreateUrlAnchor(e);

      // We create an in-memory <a> tag and store the result of the OG function
      dummyEl.innerHTML = result;
      // We find the link created inside our dummyEl
      const anchor = dummyEl.querySelector('a');

      if (anchor) {
        anchor.href = anchor.dataset.fullUrl;
        result = anchor.outerHTML;
      }

      return result;
    };
  }
}
