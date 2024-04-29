import { effect, Signal } from "@preact/signals-react";

export const signalToParam = (signal: Signal<number>, param: AudioParam) => {
  effect(() => {
    param.value = signal.value;
  });
};