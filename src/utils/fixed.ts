import { useId } from "react";

import { computed, ReadonlySignal, Signal, useComputed } from "@preact/signals-react";

function fixed(value: Signal<number>, toFix?: number): ReadonlySignal<string>;
function fixed(value: number, toFix?: number): string;
function fixed<T extends number | Signal<number>>(value: T, toFix = 2): string | ReadonlySignal<string> {
  if (value instanceof Signal) {
    const handler = () => fixed(value.value, toFix);

    try {
      useId();
      return useComputed(handler);
    } catch (e) {
      return computed(handler);
    }
  }

  return value.toFixed(toFix);
};

export { fixed };