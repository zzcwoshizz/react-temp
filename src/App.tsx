import React, { useRef, useState } from 'react';
import { useLocation, match } from 'react-router-dom';
import { useUpdateEffect, useEffectOnce } from 'react-use';
import Cookies from 'js-cookie';
import { matchRoutes } from 'react-router-config';

import './style.less';
import routes from './router/routes';
import { Store, getStores } from './store';
import { parseSearch } from '@/utils/url';
import mapRoute from './router/mapRoute';

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

export const AppContext = React.createContext<any>({});

interface Props {
  defaultPageData: any;
}

const App: React.SFC<Props> = React.memo(props => {
  const location = useLocation();

  const [children, setChildren] = useState(null);
  const [pageData, setPageData] = useState(props.defaultPageData || {});

  const elementRef = useRef(null);
  const prevPageData = useRef(pageData);

  useEffectOnce(() => {
    setChildren(elementRef.current);
  });

  useUpdateEffect(() => {
    (async () => {
      const promises = [];
      const matchs = matchRoutes(routes, location.pathname);
      const cookies = Cookies.getJSON();
      for (const { route, match } of matchs) {
        const component = route.component;
        if (!component) {
          continue;
        }
        promises.push(
          asyncData(getStores(), {
            match,
            cookies,
            query: parseSearch(elementRef.current.props.location.search),
            Component: component,
          })
        );
      }
      // resolve asyncData
      const data = await Promise.all(promises);
      const obj = {};
      data.forEach((data, index) => {
        obj[matchs[index].match.url] = data;
      });

      const pageData = { ...prevPageData.current, ...obj };
      setPageData(pageData);
      prevPageData.current = pageData;
      setChildren(elementRef.current);
    })();
  }, [location.key]);

  const element = mapRoute(routes);
  elementRef.current = element;

  return (
    <AppContext.Provider value={{ pageData: { ...pageData } }}>
      {process.env.__SERVER__ ? element : children}
    </AppContext.Provider>
  );
});

export default App;
