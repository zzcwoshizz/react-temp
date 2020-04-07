import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import createStore from './store';
import App from './App';
import routes from '@/router/routes';
import PageDataProvider from '@/common/PageDataContext';

const createApp = (context, url, store, pageData) => {
  const Root = () => {
    return (
      <Provider {...store}>
        <StaticRouter context={context} location={url}>
          <PageDataProvider defaultPageData={pageData}>
            <App />
          </PageDataProvider>
        </StaticRouter>
      </Provider>
    );
  };

  return <Root />;
};

export { createApp, createStore, routes };
