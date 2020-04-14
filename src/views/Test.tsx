import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteChildrenProps } from 'react-router-dom';

import { UserStore, Store } from '@/store';

interface Props extends RouteChildrenProps {
  user?: UserStore;
  pageData: { test: string };
}

@inject('user')
@observer
class Test extends Component<Props> {
  static asyncData(store: Store) {
    return new Promise(resolve => {
      setTimeout(() => {
        store.user.name = 'im';
        resolve({ test: 'Test' });
      }, 1000);
    });
  }

  render() {
    const {
      user,
      history,
      pageData: { test },
    } = this.props;

    return (
      <div className="hero" onClick={() => history.push('/')}>
        <h2 className="hero-1">
          {test} {user.name}
        </h2>
        <h2 className="hero-2">
          {test} {user.name}
        </h2>
      </div>
    );
  }
}

export default Test;
