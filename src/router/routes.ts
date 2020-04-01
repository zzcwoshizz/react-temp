import loadable from '@loadable/component';

import { StatusRoute_NotFound } from './StatusRoute';
import { IRouteConfig } from './mapRoutes';

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
