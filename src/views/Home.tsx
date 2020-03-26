import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteChildrenProps } from 'react-router-dom';

import { AppStore, Store } from '@/store';
import withAsyncRoute from '@/router/withAsyncRoute';

interface Props extends RouteChildrenProps {
  app?: AppStore;
  pageData: { home: 'Home' };
}

@inject('app')
@observer
class Home extends Component<Props> {
  static asyncData(store: Store) {
    return new Promise(resolve => {
      const setTimeout = process.env.__CLIENT__
        ? window.setTimeout
        : require('timers').setTimeout;
      setTimeout(() => {
        store.app.appVersion = '2.0.0';
        resolve({ home: 'Home' });
      }, 1000);
    });
  }

  render() {
    const {
      app,
      history,
      pageData: { home },
    } = this.props;

    return (
      <div className="hero" onClick={() => history.push('/hello')}>
        <h2 className="hero-1">
          {home} {app.appVersion}
        </h2>
        <h2 className="hero-2">
          {home} {app.appVersion}
        </h2>
      </div>
    );
  }
}

export default withAsyncRoute(Home);
