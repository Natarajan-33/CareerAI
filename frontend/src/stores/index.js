import { RootStore, RootStoreProvider, useRootStore, useAuthStore, useIkigaiStore, useProjectStore, useProgressStore } from './RootStore.js';

// Create a singleton instance of the RootStore
const rootStore = new RootStore();

export {
  rootStore,
  RootStoreProvider,
  useRootStore,
  useAuthStore,
  useIkigaiStore,
  useProjectStore,
  useProgressStore
};
