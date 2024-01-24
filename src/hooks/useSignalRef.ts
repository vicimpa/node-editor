import { RefObject, useMemo } from "react";

import { useSignal } from "@preact/signals-react";

export const useSignalRef = <T>(initial: T | null): RefObject<T> => {
  const signal = useSignal(initial);

  return useMemo(() => ({
    get current() {
      return signal.value;
    },
    set current(v) {
      signal.value = v;
    }
  }), [signal]);
};
