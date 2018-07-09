///<reference types="webpack-env" />
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

const delay = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
const b = { b: 'b' };
const a = { ...b, a: 'a' };
const map = new Map();
const set = new Set();

const func = async () => {
  await delay(1000);
};
func();
Array.from([]);

const arr: Array<number> = [1, 2, 3];

for (let ar of arr) {
  console.log(ar);
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
