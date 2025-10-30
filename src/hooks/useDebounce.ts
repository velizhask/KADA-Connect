import { useEffect, useState } from "react";

/**
 * Custom debounce hook
 * @param value - state value yang ingin di-debounce
 * @param delay - waktu delay (ms)
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
