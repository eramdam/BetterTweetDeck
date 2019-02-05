import PollState from '../constants/state';
import Button from './button';

class Poll {
  /**
   *
   * Creates an instance of Poll
   *
   * @param {{is_open: string, is_author: boolean}} card - a twitter object of a poll
   * @param {Element} element - a HTML element of a poll
   */
  constructor(card, element) {
    this.card = card;
    this.element = element;
    //
    this.opinions = [];
    this.buttons = [];
    //
    this.state = null;

    // determine the initial state of poll
    if (card.is_open === 'false' || card.is_author) {
      this.initialState = PollState.FINAL;
    } else if ('selected_choice' in card) {
      this.initialState = PollState.CLOSED;
    } else {
      this.initialState = PollState.OPENED;
    }
  }

  /**
   * Process the poll: set attribute observers and get inner elements for work.
   */
  process() {
    this.setAttributesObserver();

    this.footerElement = this.element.querySelector('.PollXChoice-info');

    this.footerElement
      .querySelectorAll('button')
      .forEach(button => this.buttons.push(new Button(button)));
  }

  /**
   * Adds an opinion to the poll.
   *
   * @param {Opinion} opinion - an opinion
   */
  add(opinion) {
    this.opinions.push(opinion);
  }

  /**
   * Shows the bar chart.
   */
  show() {
    const opinion = this.getOpinionWithMaxVotes();

    this.showOpinionBar(true);

    this.setMajority(opinion.index);
    this.setState(PollState.CLOSED);
    this.mark(true);
  }

  /**
   * Hides the bar chart.
   */
  hide() {
    this.showOpinionBar(false);

    this.setState(PollState.OPENED);
    this.mark(false);
  }

  /**
   * Sets a control button responsible for showing and hading the chart bar.
   *
   * @param {Element} button - a button
   */
  setControlButton(button) {
    this.controlButton = button;

    this.controlButton.addEventListener('click', () => {
      if (!this.state || this.state === PollState.OPENED) {
        this.show();
      } else {
        this.hide();
      }
    });

    // add our button to the footer
    this.footerElement.querySelector('.PollXChoice-vote').insertAdjacentElement('afterend', this.controlButton);
  }

  /**
   * Gets an opinion with a maximum absolute value.
   *
   * @private
   *
   * @return {Opinion} an opinion with a maximum absolute value
   */
  getOpinionWithMaxVotes() {
    return this.opinions.reduce((prev, cur) => (prev.value > cur.value ? prev : cur));
  }

  /**
   * Sets a majority number to the poll element.
   *
   * @private
   */
  setMajority(majorityIndex) {
    this.element.setAttribute('data-poll-vote-majority', majorityIndex.toString());
  }

  /**
   * Changes poll state.
   *
   * @private
   *
   * @param {PollState} state - a new state of poll
   */
  setState(state) {
    this.state = state;
    this.element.setAttribute('data-poll-state', state.toString());
  }

  /**
   *  Marks the footer block as active, and disables the vote button if state is true.
   *
   *  @private
   *
   *  @param {boolean} state - flag
   */
  mark(state) {
    if (state) {
      this.footerElement.classList.add('active');
    } else {
      this.footerElement.classList.remove('active');
    }

    this.disableVoteButtons(state);
  }

  /**
   * Shows or hides chart bar of opinions.
   *
   * @private
   *
   * @param {boolean} show - flag
   */
  showOpinionBar(show) {
    this.opinions.forEach(o => (show ? o.show() : o.hide()));
  }

  /**
   * Disables or enables the voting button.
   *
   * @private
   *
   * @param {boolean} disable - flag
   */
  disableVoteButtons(disable) {
    this.buttons.forEach(button => button.disable(disable));
  }

  /**
   * Sets the attribute observer to determine the outer changes in the poll.
   *
   * @private
   */
  setAttributesObserver() {
    new MutationObserver((ml, observer) => {
      const isUserVoted = !!this.element.getAttribute('data-poll-user-choice');

      if (isUserVoted) {
        this.buttons.forEach(button => button.disconnect());

        // remove our button
        this.controlButton.remove();
        //
        observer.disconnect();
      }
    }).observe(this.element, { attributes: true });
  }
}

export default Poll;
