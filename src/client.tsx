///<reference types="webpack-env" />
import React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { loadableReady } from '@loadable/component';

import createStore from './store';
import App from './App';

const createApp = Comp => {
  const Root = () => {
    return (
      <Provider {...createStore(window.__INITIAL_STATE__)}>
        <Router>
          <Comp />
        </Router>
      </Provider>
    );
  };

  return <Root />;
};

loadableReady().then(() => {
  ReactDOM.hydrate(createApp(App), document.getElementById('app'));
});

if (module.hot) {
  module.hot.accept();
}
