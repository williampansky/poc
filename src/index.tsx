import React from 'react';
import { render } from 'react-dom';
import './index.css';
import GameWrapper from './GameWrapper';
import reportWebVitals from './reportWebVitals';
import { store } from './store'
import { Provider } from 'react-redux'

const root = document.getElementById('root') as HTMLElement;

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./GameWrapper', () => {
    const GameWrapper = require('./GameWrapper').default;
    render(
      <React.StrictMode>
        <Provider store={store}>
          <GameWrapper />
        </Provider>
      </React.StrictMode>,
      root
    );
  });
}

render(
  <React.StrictMode>
    <Provider store={store}>
      <GameWrapper />
    </Provider>
  </React.StrictMode>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
