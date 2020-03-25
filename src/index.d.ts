import { Store } from './store';

export {};

declare global {
  interface Window {
    __INITIAL_STATE__: Store;
  }
}
