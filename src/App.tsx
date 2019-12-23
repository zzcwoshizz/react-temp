import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';

import Routes from './routes';

moment.locale('zh-cn');

export default class App extends React.Component {
  public render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Routes />
      </ConfigProvider>
    );
  }
}
