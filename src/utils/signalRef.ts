import { RefObject } from "react";

import { Signal, signal } from "@preact/signals-react";

export const signalRef = <T>(): RefObject<T> & Signal<T | null> => {
  const ref = signal<T | null>(null);

  return {
    get current() {
      return ref.value;
    },
    set current(v) {
      ref.value = v;
    },
    __proto__: ref
  } as any;
};