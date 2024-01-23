import { Signal, signal } from "@preact/signals-react";

export const signalCorrect = <T>(
  val: T | Signal<T>,
  correct: (v: T) => T
) => (
  val = val instanceof Signal ? val : signal(correct(val)),
  ({
    __proto__: val,
    get value() {
      return val.value;
    },
    set value(v: T) {
      val.value = correct(v);
    }
  }) as any as Signal<T>
);