import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

const render = () => {
  ReactDOM.render(
    <div>Hello from BTD</div>,
    document.getElementById('app'),
  );
};

render();


if (module.hot) {
  module.hot.accept('./options.js', () => {
    render();
  });
}
