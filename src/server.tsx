import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';

const app = express();

const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
    pathRewrite: { '^/api': '' },
  },
};

// proxy
Object.keys(proxy).forEach(key => {
  app.use(key, createProxyMiddleware(proxy[key]));
});

app.use('/static', express.static(path.resolve(__dirname, '../static')));

const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React</title>
</head>

<body>
  <!--server-->
</body>

</html>
`;

app.get('*', (req, res) => {
  res.send(
    html.replace(
      '<!--server-->',
      `<div id="app">${renderToString(<App />)}</div>`
    )
  );
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
