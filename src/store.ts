import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';

import * as stores from './stores';

const history = syncHistoryWithStore(
  createBrowserHistory({
    basename: '/',
  }),
  stores.routing
);

history.subscribe(() => {});

export { history };

export default stores;
