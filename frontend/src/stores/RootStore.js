import { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore.js';
import { IkigaiStore } from './IkigaiStore.js';
import { ProjectStore } from './ProjectStore.js';
import { ProgressStore } from './ProgressStore.js';

/**
 * Root store that combines all other stores
 */
export class RootStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.ikigaiStore = new IkigaiStore(this);
    this.projectStore = new ProjectStore(this);
    this.progressStore = new ProgressStore(this);
  }
}

// Create a React context for the root store
const RootStoreContext = createContext(null);

// Provider component for the root store
export const RootStoreProvider = RootStoreContext.Provider;

// Hook to use the root store
export const useRootStore = () => {
  const context = useContext(RootStoreContext);
  if (context === null) {
    throw new Error('useRootStore must be used within a RootStoreProvider');
  }
  return context;
};

// Hooks to use individual stores
export const useAuthStore = () => useRootStore().authStore;
export const useIkigaiStore = () => useRootStore().ikigaiStore;
export const useProjectStore = () => useRootStore().projectStore;
export const useProgressStore = () => useRootStore().progressStore;
