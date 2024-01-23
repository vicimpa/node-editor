import { useCallback, useRef } from "react";

export const useEvent = (
  <A extends any[], R>(fn: (...args: A) => R) => {
    const ref = useRef(fn);
    ref.current = fn;
    return (
      ref.current = fn,
      useCallback((...args: A) => {
        const { current } = ref;
        return current(...args);
      }, [])
    );
  }
);