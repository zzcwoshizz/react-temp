import React from 'react';
import { Switch } from 'react-router-dom';

import './style.less';
import routes from './router/routes';
import { mapRoutes } from './router/mapRoutes';

export default class App extends React.Component {
  public render() {
    return <Switch>{mapRoutes(routes)}</Switch>;
  }
}
