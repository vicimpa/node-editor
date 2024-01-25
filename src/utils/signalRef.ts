import { RefObject } from "react";

import { signal } from "@preact/signals-react";

export const signalRef = <T>(): RefObject<T> => {
  const ref = signal<T | null>(null);

  return {
    get current() {
      return ref.value;
    },
    set current(v) {
      ref.value = v;
    }
  };
};