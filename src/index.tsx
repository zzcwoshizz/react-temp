///<reference types="webpack-env" />
import '@/assets/styles/index.less';

import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import App from './App';

ReactDOM.render(
  <Router
    history={createBrowserHistory({
      basename: '/',
    })}
  >
    <App />
  </Router>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
