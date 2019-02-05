import Poll from './models/poll';
import PollState from './constants/state';
import Opinion from './models/opinion';
import { send as sendMessage } from '../../util/messaging';
//
import Icon from '../../../icons/poll.svg';

/**
 * Content script
 */
(() => {
  /**
   * Creates a bar chart button.
   */
  function createButton() {
    const button = document.createElement('span');
    // button.innerHTML = 'Poll';
    button.innerHTML = Icon;
    button.classList.add('btn-results');

    return button;
  }

  /**
   * Injects the button.
   */
  function run() {
    // check if tweet is a poll
    const element = document.querySelector('.PollXChoice');

    if (!element) {
      return;
    }

    // get twitter data object
    const twitterInitObject = document.querySelector('script[type="text/twitter-cards-serialization"]').innerHTML;

    // extract the card object
    const card = JSON.parse(twitterInitObject).card;

    const poll = new Poll(card, element);

    if (poll.initialState === PollState.CLOSED || poll.initialState === PollState.FINAL) {
      return;
    }

    poll.process();
    poll.setControlButton(createButton());

    // get all opinions, create the opinion objects and add them to the poll.
    element.querySelectorAll('.PollXChoice-choice').forEach(e => poll.add(new Opinion(e)));
  }

  sendMessage({ action: 'get_settings' }, (response) => {
    if (response.settings && response.settings.show_poll_results) {
      run();
    }
  });
})();
