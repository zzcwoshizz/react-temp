import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router } from 'react-router-dom';

import '@/assets/styles/index.less';
import store, { history } from './store';
import App from './App';

ReactDOM.render(
  <Provider {...store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
