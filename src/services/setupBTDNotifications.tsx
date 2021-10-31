import React, {useLayoutEffect} from 'react';
import ReactDOM from 'react-dom';

import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/btdMessageTypes';

const Notifications = () => {
  useLayoutEffect(() => {
    listenToInternalBTDMessage(
      BTDMessages.NOTIFICATION,
      BTDMessageOriginsEnum.CONTENT,
      async (ev) => {
        if (ev.data.name !== BTDMessages.NOTIFICATION) {
          return;
        }

        console.log(ev.data);
      }
    );
  }, []);

  return <div></div>;
};

export function setupBTDNotifications() {
  ReactDOM.render(<Notifications />, document.getElementById('btd-notifications-root'));
}
