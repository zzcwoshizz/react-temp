import React from 'react';
import Cookies from 'js-cookie';

import { getStores } from '@/store';
import { PageDataContext } from '@/common/PageDataContext';
import Head from '@/common/Head';

let first = true; // 第一次进入页面
let _current: any; // 当前渲染组件
if (process.env.__CLIENT__) {
  window.addEventListener('popstate', e => {});
}

export default function withAsyncRoute(Comp: any) {
  return class AsyncRoute extends React.Component<any, any> {
    static contextType = PageDataContext;
    // 服务端调用
    static async asyncData(store, { match, cookies }) {
      return Comp.asyncData
        ? await Comp.asyncData(store, { match, cookies })
        : {};
    }

    constructor(props, context) {
      super(props, context);

      this.state = {
        path: props.match.path,
        pageData: {},
      };
    }

    // 客户端调用
    async asyncData() {
      const { match } = this.props;
      const cookies = Cookies.getJSON();
      const pageData = Comp.asyncData
        ? await Comp.asyncData(getStores(), { match, cookies })
        : {};
      this.setState({
        pageData,
      });
    }

    async componentDidMount() {
      _current = this;
      if (first) {
        // 首次进入页面不重新获取数据
        first = false;
        return;
      }
      await this.asyncData();
    }

    render() {
      let pageData = {};
      if (process.env.__SERVER__) {
        pageData = { ...this.context[this.state.path] };
      } else {
        if (first) {
          pageData = { ...this.context[this.state.path] };
        } else {
          pageData = { ...this.state.pageData };
        }
      }

      return [
        <Head key="0" title="React-Server side render" />,
        <Comp key="1" {...this.props} pageData={pageData} />,
      ];
    }
  };
}
