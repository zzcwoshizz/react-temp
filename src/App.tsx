import React, { Fragment, useRef, useState } from 'react';
import { useLocation, useHistory, matchPath, match } from 'react-router-dom';
import { useUpdateEffect, useEffectOnce } from 'react-use';
import Cookies from 'js-cookie';

import './style.less';
import routes from './router/routes';
import { Store, getStores } from './store';
import { parseSearch } from '@/utils/url';

export type AsyncFunction<
  S = any,
  Params extends { [K in keyof Params]?: string } = {}
> = (
  store: S,
  params: {
    match: match<Params>;
    cookies: { [K in keyof Params]?: string };
    headers?: { [K: string]: string };
    query: { [K: string]: string };
    Component: any;
  }
) => Promise<any>;
export interface FunctionView<
  S = any,
  Params extends { [K in keyof Params]?: string } = {}
> {
  asyncData?: AsyncFunction<S, Params>;
}

const loadComponent = async component => {
  while (true) {
    if (component.preload) {
      // 异步组件
      component = (await component.load()).default;
    } else {
      break;
    }
  }
  return component;
};

export const asyncData: AsyncFunction<Store> = async (
  stores,
  { match, cookies, headers, query, Component }
) => {
  let pageData = {};
  Component = await loadComponent(Component);
  if (Component.asyncData) {
    try {
      pageData = await Component.asyncData(stores, {
        match,
        cookies,
        headers,
        query,
        Component,
      });
    } catch (e) {
      pageData = {};
    }
  }

  return pageData;
};

interface Props {
  defaultPageData: any;
}

const App: React.SFC<Props> = React.memo(props => {
  const location = useLocation();
  const history = useHistory();

  const [children, setChildren] = useState(null);
  const [pageData, setPageData] = useState(props.defaultPageData || {});

  const elementRef = useRef(null);

  useEffectOnce(() => {
    setChildren(elementRef.current);
  });

  useUpdateEffect(() => {
    (async () => {
      if (elementRef.current) {
        const cookies = Cookies.getJSON();

        const promises = [];
        for (const element of elementRef.current) {
          const component = element.type;
          promises.push(
            asyncData(getStores(), {
              match: element.props.match,
              cookies,
              query: parseSearch(element.props.location.search),
              Component: component,
            })
          );
        }

        const _pageData = await Promise.all(promises);
        const obj = {};
        _pageData.forEach((data, index) => {
          obj[elementRef.current[index].props.match.url] = data;
        });
        setPageData({ ...pageData, ...obj });
        setChildren(
          React.Children.map(elementRef.current, child =>
            React.cloneElement(child, {
              ...child.props,
              pageData: { ...obj[child.props.match.url] },
            })
          )
        );
      }
    })();
  }, [location.key]);

  const elements = [];
  let match = null;
  routes.forEach((route, index) => {
    if (match === null) {
      match = matchPath(location.pathname, { ...route });
      let Component;
      if (match) {
        if (route.render) {
          Component = props => route.render({ ...props });
        } else {
          Component = route.component;
        }
        const element = (
          <Component
            key={location.key + '-' + index}
            location={location}
            history={history}
            match={match}
            route={route}
            pageData={pageData[match.url]}
          />
        );
        elements.push(element);
      }
    }
  });
  elementRef.current = elements;

  return <Fragment>{process.env.__SERVER__ ? elements : children}</Fragment>;
});

export default App;
