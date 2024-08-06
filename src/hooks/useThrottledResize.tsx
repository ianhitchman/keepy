import { useEffect, useRef } from "react";

const useThrottledResize = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback();
        lastRan.current = now;
      } else {
        timeoutRef.current = window.setTimeout(() => {
          callback();
          lastRan.current = Date.now();
        }, delay - (now - lastRan.current));
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [callback, delay]);
};

export default useThrottledResize;
