import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const App = (props) => {
  return (
    <div>
      Hello world {JSON.stringify(props.store.settings)}
    </div>
  );
};

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(App);
