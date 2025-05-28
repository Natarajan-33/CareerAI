import React, { createContext, useContext } from 'react';
import { AuthStore } from './authStore';
import { IkigaiStore } from './ikigaiStore';
import { ProjectStore } from './projectStore';

// Create the root store class
class RootStore {
  constructor() {
    // Initialize all stores and inject dependencies
    this.authStore = new AuthStore(this);
    this.ikigaiStore = new IkigaiStore(this);
    this.projectStore = new ProjectStore(this);
  }
}

// Create the store context
const StoreContext = createContext(null);

// Create a provider component
export const StoreProvider = ({ children }) => {
  // Create store instance only once using React.useState
  const [rootStore] = React.useState(() => new RootStore());
  
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to use the store in components
export const useStores = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return store;
};

// Hook to use a specific store
export const useStore = (storeName) => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store[storeName];
};
