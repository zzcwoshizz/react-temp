import * as React from 'react';

import 'nprogress/nprogress.css';
import Nprogress from 'nprogress';

export default class Progress extends React.PureComponent {
  public componentDidMount() {
    Nprogress.start();
  }

  public componentWillUnmount() {
    setTimeout(() => {
      Nprogress.done();
    }, 300);
  }

  public render() {
    return null;
  }
}
