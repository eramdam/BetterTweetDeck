import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );
};

render();


if (module.hot) {
  module.hot.accept('./options.js', () => {
    render();
  });
}
