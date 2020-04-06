import React from 'react';
import Cookies from 'js-cookie';
import { Request } from 'express';

import { getStores } from '@/store';
import { PageDataContext } from '@/common/PageDataContext';
import Head from '@/common/Head';
import { match } from 'react-router-dom';

let first = true; // 第一次进入页面
let _current: any; // 当前渲染组件
if (process.env.__CLIENT__) {
  window.addEventListener('popstate', e => {});
}

export type AsyncFunction<
  S = any,
  Params extends { [K in keyof Params]?: string } = {}
> = (
  store: S,
  params: {
    match: match<Params>;
    cookies: { [K in keyof Params]?: string };
    req?: Request;
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

export default function withAsyncRoute(Comp: any) {
  return class AsyncRoute extends React.Component<any, any> {
    static contextType = PageDataContext;
    // 服务端调用
    static asyncData: AsyncFunction = async (
      store,
      { match, cookies, req }
    ) => {
      const component = await loadComponent(Comp);
      if (component.asyncData) {
        return await component.asyncData(store, { match, cookies, req });
      } else {
        return {};
      }
    };

    constructor(props, context) {
      super(props, context);

      this.state = {
        url: props.match.url,
        pageData: { ...context[props.match.url] },
      };
    }

    // 客户端调用
    async asyncData() {
      const { match } = this.props;
      const cookies = Cookies.getJSON();
      const component = await loadComponent(Comp);
      const pageData = component.asyncData
        ? await component.asyncData(getStores(), { match, cookies })
        : {};
      this.setState({
        pageData,
      });
    }

    componentDidUpdate(prevProps) {
      // 当路由发生改变时进行数据获取
      if (this.props.location.key !== prevProps.location.key) {
        this.asyncData();
      }
    }

    componentWillUnmount() {
      // 组件unmount时设置为false
      first = false;
    }

    async componentDidMount() {
      _current = this;
      if (first) {
        // 首次进入页面不重新获取数据
        return;
      }
      await this.asyncData();
    }

    render() {
      let pageData = {};
      if (process.env.__SERVER__) {
        pageData = { ...this.context[this.state.url] };
      } else {
        if (first) {
          pageData = this.context[this.state.url];
        } else {
          pageData = this.state.pageData;
        }
      }

      return [
        <Head key="0" title="React-Server side render" />,
        <Comp key="1" {...this.props} pageData={pageData} />,
      ];
    }
  };
}
