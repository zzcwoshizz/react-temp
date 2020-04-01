import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from 'react-router-config';

export interface IRouteConfig extends RouteConfig {
  auth?: boolean;
}

export function mapRoutes(routes: IRouteConfig[]) {
  return routes
    ? routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {
              let Component;
              if (route.render) {
                Component = props => route.render({ ...props });
              } else {
                Component = route.component;
              }
              return <Component {...props} route={route} />;
            }}
          />
        );
      })
    : null;
}
