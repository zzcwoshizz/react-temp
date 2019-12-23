import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import RouteLayout from './RouteLayout';
import routeConfig, { RouteConfig } from './config';
import { combineURL } from '@/utils/url';

const withRoute = (config: RouteConfig, basePath: string) => {
  const path = combineURL(basePath, config.path);

  if (config.children && config.children.length > 0) {
    let _return: React.ReactChild;
    if (config.redirect) {
      _return = (
        <Redirect
          key={path}
          to={config.redirect}
          exact={config.exact}
          path={path}
        />
      );
    } else {
      _return = (
        <Route
          key={path}
          exact={config.exact}
          path={path}
          component={config.component}
        />
      );
    }

    return mapConfig(config.children, path).concat([_return]);
  }

  if (config.redirect) {
    return (
      <Redirect
        key={path}
        to={config.redirect}
        exact={config.exact}
        path={path}
      />
    );
  }

  return (
    <Route
      key={path}
      exact={config.exact}
      path={path}
      component={config.component}
    />
  );
};

const mapConfig = (configs: RouteConfig[], basePath: string) => {
  return configs.map(config => withRoute(config, basePath));
};

export default class Routes extends React.Component {
  public render() {
    return (
      <Route
        render={props => {
          return (
            <RouteLayout>
              <Switch location={props.location}>
                {mapConfig(routeConfig, '')}
              </Switch>
            </RouteLayout>
          );
        }}
      />
    );
  }
}
