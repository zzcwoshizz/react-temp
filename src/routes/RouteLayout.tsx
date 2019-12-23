import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import {
  RouteChildrenProps,
  withRouter,
  matchPath,
  Link,
} from 'react-router-dom';

import routeConfig, { RouteConfig } from './config';
import { combineURL } from '@/utils/url';

const { Content, Sider, Header } = Layout;
const { SubMenu } = Menu;

interface State {
  collapsed: boolean;
  openKeys: string[];
}

interface BreadcrumbConfig {
  path: string;
  title: string;
}

class RouteLayout extends PureComponent<RouteChildrenProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      openKeys: [],
    };
  }

  public toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  // 以下两个方法是遍历config生成面包屑
  public dfsConfig = (
    config: RouteConfig,
    basePath: string,
    pathArray: BreadcrumbConfig[]
  ): boolean => {
    const path = combineURL(basePath, config.path);

    pathArray.push({
      path,
      title: config.title,
    });

    if (config.children && config.children.length > 0) {
      let flag = false;
      for (let i = 0; i < config.children.length; i++) {
        if (this.dfsConfig(config.children[i], path, pathArray)) {
          flag = true;
          break;
        }
      }
      if (flag === false) {
        pathArray.pop();
      }
      return flag;
    }

    if (
      matchPath(this.props.location.pathname, {
        path,
        exact: config.exact,
      })
    ) {
      return true;
    }

    pathArray.pop();
    return false;
  };
  public mapConfig = (configs: RouteConfig[]): BreadcrumbConfig[] => {
    let pathArray = [];
    configs.forEach(config => {
      const array = [];
      const flag = this.dfsConfig(config, '', array);

      if (flag && pathArray.length === 0) {
        pathArray = array;
      }
    });
    return pathArray;
  };

  // 以下两个方法是遍历config生成menu
  public withMenu = (
    config: RouteConfig,
    basePath: string
  ): React.ReactChild => {
    if (config.hidden) {
      return null;
    }

    const path = combineURL(basePath, config.path);

    if (config.children && config.children.length > 0) {
      return (
        <SubMenu
          key={path}
          title={[
            <Icon type={config.icon} key="0" />,
            <span key="1">{config.title}</span>,
          ]}
        >
          {this.mapMenus(config.children, path)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={path}>
        <Icon type={config.icon} />
        <span>{config.title}</span>
      </Menu.Item>
    );
  };
  public mapMenus = (
    configs: RouteConfig[],
    basePath: string
  ): React.ReactChild[] => {
    return configs.map(config => this.withMenu(config, basePath));
  };

  public componentDidMount() {
    const pathArray = this.mapConfig(routeConfig);
    this.setState({ openKeys: pathArray.map(p => p.path) });
  }

  public render() {
    const pathArray = this.mapConfig(routeConfig);
    const menus = this.mapMenus(routeConfig, '');

    return (
      <Layout style={{ minWidth: 1200 }}>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            openKeys={this.state.openKeys}
            selectedKeys={[pathArray[pathArray.length - 1].path]}
            onOpenChange={openKeys => this.setState({ openKeys })}
            onClick={el => {
              this.props.history.push(el.key);
            }}
          >
            {menus}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
          <Header style={{ background: '#fff', padding: '0 20px' }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ minHeight: 'calc(100vh - 64px)', padding: 20 }}>
            <Breadcrumb style={{ marginBottom: 20 }}>
              <Breadcrumb.Item key="/">
                <Link to="/">首页</Link>
              </Breadcrumb.Item>
              {pathArray.map(p => (
                <Breadcrumb.Item key={p.path}>
                  <Link to={p.path}>{p.title}</Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(RouteLayout);
