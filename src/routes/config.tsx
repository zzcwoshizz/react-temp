import * as React from 'react';
import Loadable from 'react-loadable';

import Progress from '@/components/Loading/Progress';

const Loading = ({ error, pastDelay }) => {
  if (error) {
    return <Progress />;
  } else if (pastDelay) {
    return <Progress />;
  } else {
    return null;
  }
};

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "Home" */ '@/pages/Home'),
  loading: Loading,
});

export interface RouteConfig {
  path: string; // 路由
  title: string; // menu文字
  icon?: string; // menu图标
  exact?: boolean; // react-router的props 是否完全匹配
  redirect?: string; // 重定向
  component?: React.ComponentType; // 渲染的页面组件
  children?: RouteConfig[]; // 子路由，menu的子菜单
  hidden?: boolean; // 是否在menu中显示
}

const routeConfig: RouteConfig[] = [
  {
    path: '/',
    icon: 'dashboard',
    title: 'Dashboard',
    exact: true,
    component: Home,
  },
  {
    path: '/list',
    icon: 'control',
    exact: true,
    title: '列表',
    redirect: '/operation/config', // 跳转到第一个children
    children: [
      {
        path: 'home',
        icon: 'dashboard',
        title: 'Home',
        component: Home,
      },
    ],
  },
  {
    path: '',
    redirect: '/',
    title: '404',
    hidden: true,
  },
];

export default routeConfig;
