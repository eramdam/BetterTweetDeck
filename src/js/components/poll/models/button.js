/**
 * class Button encapsulates basic behavior of twitter button
 */
class Button {
  constructor(element) {
    this.element = element;

    // Stores a state of button.
    this.initState = true;
    // observe button attributes to catch user and twitter actions
    this.observer = new MutationObserver(() => {
      // check if user clicked on an opinion but hasn't voted yet
      if (this.element.getAttribute('data-card-scribe-data')) {
        this.initState = false;
      }
    });

    this.observer.observe(this.element, { attributes: true });
  }

  /**
   * Disables or enables the button.
   *
   * @param {boolean} state - flag
   */
  disable(state) {
    this.element.disabled = state || this.initState;
  }

  /**
   * Disconnects the observer from the button.
   */
  disconnect() {
    this.observer.disconnect();
  }
}

export default Button;
