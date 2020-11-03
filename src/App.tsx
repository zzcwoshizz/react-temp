import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

export default class App extends React.Component {
  public render() {
    return (
      <ConfigProvider locale={en_US}>
        <Suspense fallback="...">
          <Switch>
            <Route component={lazy(() => import('@/pages/Home'))} exact path="/" />
          </Switch>
        </Suspense>
      </ConfigProvider>
    );
  }
}
