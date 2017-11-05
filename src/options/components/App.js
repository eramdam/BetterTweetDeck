import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const App = (props) => {
  return (
    <div>
      Hello world
      <button onClick={() => {
        props.store.saveSettings();
      }}
      >
        Save
      </button>
      <pre>
        {JSON.stringify(props.store.settings, null, 2)}
      </pre>
    </div>
  );
};

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(App);
