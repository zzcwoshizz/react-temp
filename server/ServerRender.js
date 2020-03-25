const ReactDOM = require('react-dom/server');
const React = require('react');
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server');
const { matchRoutes } = require('react-router-config');

const paths = require('../config/paths');

class ServerRender {
  entryName = paths.entry;
  createApp;
  createStore;
  clientStats;
  routes;
  template;

  renderToString = async req => {
    const store = this.createStore({});

    let statusCode = 200;

    // 匹配路由
    let url = req.url;
    try {
      await this._matchRoute(req, store);
    } catch (e) {
      throw e;
    }

    let context = {};

    // 生成HTML代码
    let extractor = new ChunkExtractor({
      stats: this.clientStats,
      entrypoints: [this.entryName], // 入口entry
    });
    const App = this.createApp(context, url, store);
    const htmlStr = ReactDOM.renderToString(
      React.createElement(ChunkExtractorManager, { extractor }, App)
    );

    // statusCode不为空表示匹配失败，返回错误的http code
    if (context.statusCode) {
      statusCode = context.statusCode;
    }

    // 获取assets
    const assets = this._getAssets(extractor);
    const storeJSON = JSON.stringify(store);

    return {
      statusCode,
      html: this.template
        .replace('<!--react-ssr-head-->', `${assets.style}${assets.css}`)
        .replace(
          '<!--react-ssr-outlet-->',
          `<script type="text/javascript">window.__INITIAL_STATE__=${storeJSON}</script><div id="app">${htmlStr}</div>${assets.js}`
        ),
    };
  };

  async _matchRoute(req, store) {
    let promises = [];
    const matchs = matchRoutes(this.routes, req.url);
    for (let { route, match } of matchs) {
      let component = route.component;
      if (!component) {
        continue;
      }
      if (component.preload) {
        // 异步组件
        component = (await component.load()).default;
      }
      if (component.asyncData) {
        promises.push(component.asyncData(store, { match, req }));
      }
    }
    // resolve asyncData
    await Promise.all(promises);
  }

  _getAssets(extractor) {
    return {
      js: extractor.getScriptTags(),
      style: extractor.getStyleTags(),
      css: extractor.getLinkTags(),
    };
  }
}

module.exports = ServerRender;
