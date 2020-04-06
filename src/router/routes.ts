import loadable from '@loadable/component';

import { StatusRoute_NotFound } from './StatusRoute';
import { IRouteConfig } from './mapRoutes';
import withAsyncRoute from './withAsyncRoute';

const routes: IRouteConfig[] = [
  {
    path: '/hello',
    component: withAsyncRoute(loadable(() => import('@/views/Hello'))),
  },
  {
    path: '/',
    component: withAsyncRoute(loadable(() => import('@/views/Home'))),
    exact: true,
  },
  {
    component: withAsyncRoute(StatusRoute_NotFound),
  },
];

export default routes;
