import { useState, useEffect } from "react";

type StorageType = "local" | "session";

function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = "local"
) {
  const isClient = typeof window !== "undefined";
  const storage = isClient
    ? storageType === "local"
      ? window.localStorage
      : window.sessionStorage
    : null;

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isClient || !storage) return;
    try {
      const item = storage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      setIsLoaded(true);
    } catch (error) {
      console.warn(`Error reading storage key "${key}":`, error);
      setIsLoaded(true);
    }
  }, [key, isClient, storage]);

  useEffect(() => {
    if (!isClient || !storage || !isLoaded) return;
    try {
      storage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting storage key "${key}":`, error);
    }
  }, [key, storedValue, storage, isClient, isLoaded]);

  return [storedValue, setStoredValue] as const;
}

export default useStorage;
