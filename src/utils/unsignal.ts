import { Signal } from "@preact/signals-react";

export type MaybeSignal<T> = Signal<T> | T;

export const unsignal = <T>(signal: MaybeSignal<T>) => {
  if (signal instanceof Signal)
    return signal.value;

  return signal;
};
