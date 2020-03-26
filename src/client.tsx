///<reference types="webpack-env" />
import React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { loadableReady } from '@loadable/component';

import createStore from './store';
import App from './App';
import { PageDataContext } from '@/common/PageDataContext';

const storeData = window.__INITIAL_STATE__;
const pageData = window.__INITIAL_DATA__;

const createApp = Comp => {
  const Root = () => {
    return (
      <Provider {...createStore(storeData)}>
        <Router>
          <PageDataContext.Provider value={pageData}>
            <Comp />
          </PageDataContext.Provider>
        </Router>
      </Provider>
    );
  };

  return <Root />;
};

loadableReady().then(() => {
  ReactDOM.hydrate(createApp(App), document.getElementById('app'));

  window.__INITIAL_STATE__ = null;
  window.__INITIAL_DATA__ = {};
});

if (module.hot) {
  module.hot.accept();
}
