import { useEffect, useRef } from 'react';

const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear the timer when the component unmounts or if delay changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delay]);

  const debounce = (...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debounce;
};

export default useDebounce;
