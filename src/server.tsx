import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import createStore from './store';
import App, { asyncData } from './App';
import routes from '@/router/routes';

const createApp = (context, url, store, pageData) => {
  const Root = () => {
    return (
      <Provider {...store}>
        <StaticRouter context={context} location={url}>
          <App defaultPageData={pageData} />
        </StaticRouter>
      </Provider>
    );
  };

  return <Root />;
};

export { createApp, createStore, routes, asyncData };
