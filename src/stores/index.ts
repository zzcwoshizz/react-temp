import Routing from './routingStore';

const routing = new Routing();

export { routing };

if (module.hot) {
  module.hot.decline();
}
