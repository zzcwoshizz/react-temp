const ReactDOM = require('react-dom/server');
const React = require('react');
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server');
const { matchRoutes } = require('react-router-config');
const { Helmet } = require('react-helmet');

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
    let pageData;
    try {
      pageData = await this._matchRoute(req, store);
    } catch (e) {
      throw e;
    }

    let context = {};

    // 生成HTML代码
    let extractor = new ChunkExtractor({
      stats: this.clientStats,
      entrypoints: [this.entryName], // 入口entry
    });
    const App = this.createApp(context, url, store, pageData);
    const htmlStr = ReactDOM.renderToString(
      React.createElement(ChunkExtractorManager, { extractor }, App)
    );

    // statusCode不为空表示匹配失败，返回错误的http code
    if (context.statusCode) {
      statusCode = context.statusCode;
    }

    const helmet = Helmet.renderStatic();
    const headerStr =
      helmet.meta.toString() +
      helmet.title.toString() +
      helmet.link.toString() +
      helmet.script.toString() +
      helmet.style.toString();

    // 获取assets
    const assets = this._getAssets(extractor);
    const storeJSON = JSON.stringify(store);
    const dataJSON = JSON.stringify(pageData);

    return {
      statusCode,
      html: this.template
        .replace(
          '<!--react-ssr-head-->',
          `${headerStr}${assets.style}${assets.css}`
        )
        .replace(
          '<!--react-ssr-outlet-->',
          `<script type="text/javascript">window.__INITIAL_STATE__=${storeJSON};window.__INITIAL_DATA__=${dataJSON}</script><div id="app">${htmlStr}</div>${assets.js}`
        ),
    };
  };

  async _matchRoute(req, store) {
    const cookies = req.cookies;

    let promises = [];
    const matchs = matchRoutes(this.routes, req.path);
    for (let { route, match } of matchs) {
      let component = route.component;
      if (!component) {
        continue;
      }
      if (component.asyncData) {
        promises.push(
          component.asyncData(store, {
            match,
            cookies,
            query: req.query,
            headers: req.headers,
          })
        );
      } else {
        promises.push(Promise.resolve({}));
      }
    }
    // resolve asyncData
    const pageData = await Promise.all(promises);
    let obj = {};
    pageData.forEach((data, index) => {
      obj[matchs[index].match.url] = data;
    });
    return obj;
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
