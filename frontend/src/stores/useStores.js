import { useRootStore } from './RootStore';

/**
 * Hook to access all stores at once
 * @returns {Object} Object containing all stores
 */
export const useStores = () => {
  const rootStore = useRootStore();
  return {
    authStore: rootStore.authStore,
    ikigaiStore: rootStore.ikigaiStore,
    projectStore: rootStore.projectStore,
    progressStore: rootStore.progressStore
  };
};
