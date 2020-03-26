import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import createStore from './store';
import App from './App';
import routes from '@/router/routes';
import { PageDataContext } from './PageDataContext';

const createApp = (context, url, store, pageData) => {
  const Root = () => {
    return (
      <Provider {...store}>
        <StaticRouter context={context} location={url}>
          <PageDataContext.Provider value={pageData}>
            <App />
          </PageDataContext.Provider>
        </StaticRouter>
      </Provider>
    );
  };

  return <Root />;
};

export { createApp, createStore, routes };
