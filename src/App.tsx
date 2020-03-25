import React from 'react';
import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import './style.less';
import routes from './router/routes';

export default class App extends React.Component {
  public render() {
    return <Switch>{renderRoutes(routes)}</Switch>;
  }
}
