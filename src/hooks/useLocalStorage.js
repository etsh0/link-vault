import { useState, useEffect } from 'react';

/**
 * Reactive localStorage hook that seeds initialValue when the key is absent.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore storage quota or private-mode write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
