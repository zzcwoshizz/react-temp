import React, { useContext } from 'react';
import { useLocation, useHistory, matchPath } from 'react-router-dom';

import { IRouteConfig } from './routes';
import { AppContext } from '@/App';

export default function mapRoute(routes: IRouteConfig[]) {
  const location = useLocation();
  const history = useHistory();

  let element = null;
  let match = null;
  routes.forEach((route, index) => {
    if (match === null) {
      match = matchPath(location.pathname, { ...route });
      if (match) {
        const Component: any = props => {
          const context = useContext(AppContext);
          const pageData = { ...context.pageData[props.match.url] };

          return route.render ? (
            route.render({ ...props, pageData })
          ) : (
            <route.component {...props} pageData={pageData} />
          );
        };
        const _element = (
          <Component
            key={location.key + '-' + index}
            location={location}
            history={history}
            match={match}
            route={route}
          />
        );
        element = _element;
      }
    }
  });

  return element;
}
