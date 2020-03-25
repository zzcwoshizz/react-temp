import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteChildrenProps } from 'react-router-dom';

import { UserStore } from '@/store';

interface Props extends RouteChildrenProps {
  user?: UserStore;
}

@inject('user')
@observer
class Hello extends Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <div className="hero">
        <h2 className="hero-1">Hello {user.name}</h2>
        <h2 className="hero-2">Hello {user.name}</h2>
      </div>
    );
  }
}

export default Hello;
