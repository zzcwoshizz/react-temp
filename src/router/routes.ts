import loadable from '@loadable/component';
import { RouteConfig } from 'react-router-config';

import { StatusRoute_NotFound } from './StatusRoute';

export interface IRouteConfig extends RouteConfig {
  auth?: boolean;
}

const routes: IRouteConfig[] = [
  {
    path: '/hello',
    component: loadable(() => import('@/views/Hello')),
  },
  {
    path: '/',
    component: loadable(() => import('@/views/Home')),
    exact: true,
  },
  {
    component: StatusRoute_NotFound,
  },
];

export default routes;
