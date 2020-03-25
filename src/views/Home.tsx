import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteChildrenProps } from 'react-router-dom';

import { AppStore } from '@/store';

interface Props extends RouteChildrenProps {
  app?: AppStore;
}

@inject('app')
@observer
class Home extends Component<Props> {
  static asyncData(store, { req }) {
    store.app.appVersion = '2.0.0';
  }

  render() {
    const { app, history } = this.props;

    return (
      <div className="hero" onClick={() => history.push('/hello')}>
        <h2 className="hero-1">{app.appVersion}</h2>
        <h2 className="hero-2">{app.appVersion}</h2>
      </div>
    );
  }
}

export default Home;
