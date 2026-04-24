import { useEffect, useState } from 'react';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function createLocalStorageAdapter(key, fallbackState) {
  return {
    async load() {
      if (!canUseStorage()) {
        return fallbackState;
      }

      try {
        const stored = window.localStorage.getItem(key);
        return stored ? { ...fallbackState, ...JSON.parse(stored) } : fallbackState;
      } catch {
        return fallbackState;
      }
    },
    async save(nextState) {
      if (!canUseStorage()) {
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(nextState));
    },
  };
}

export function createFirebaseAdapter() {
  return {
    async load() {
      throw new Error('Firebase adapter not configured yet.');
    },
    async save() {
      throw new Error('Firebase adapter not configured yet.');
    },
  };
}

export function usePersistentPageState(adapter, fallbackState) {
  const [state, setState] = useState(fallbackState);

  useEffect(() => {
    let isMounted = true;

    adapter.load().then((loadedState) => {
      if (isMounted && loadedState) {
        setState((current) => ({ ...current, ...loadedState }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [adapter]);

  useEffect(() => {
    adapter.save(state);
  }, [adapter, state]);

  return [state, setState];
}
