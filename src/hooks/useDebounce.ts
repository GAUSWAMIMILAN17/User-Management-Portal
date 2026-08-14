import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g. search input).
 * Ensures smooth search UI without sluggish multi-render hits.
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
