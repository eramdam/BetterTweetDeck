/**
 * Class Opinion
 */
class Opinion {
  get percentage() {
    return this.progressElement.innerHTML;
  }

  /**
   * Percentage in the absolute value
   *
   * @return {number}
   */
  get value() {
    return parseInt(this.percentage.replace('%', ''), 10);
  }

  /**
   * Creates an instance of Opinion
   *
   * @param {Element} element - an opinion element
   */
  constructor(element) {
    this.inputElement = element.querySelector('.PollXChoice-choice--input');
    this.chartElement = element.querySelector('.PollXChoice-choice--chart');
    this.progressElement = element.querySelector('.PollXChoice-progress');

    this.index = parseInt(element.getAttribute('data-poll-index'), 10);
  }

  /**
   * Sets percentage to the bar, and disables the input field.
   */
  show() {
    this.chartElement.style.width = this.percentage;
    this.disable(true);
  }

  /**
   * Enables the input field.
   */
  hide() {
    this.disable(false);
  }

  /**
   * Disables or enables the opinion for voting
   *
   * @param {boolean} state - flag
   */
  disable(state) {
    this.inputElement.disabled = state;
  }
}

export default Opinion;
