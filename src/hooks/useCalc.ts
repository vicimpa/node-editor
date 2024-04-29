import { useLayoutEffect } from "react";

import { looper, runLoop, TLoop } from "@/utils/looper";
import { useSignal } from "@preact/signals-react";

export const useCalc = <T>(fn: TLoop<T>) => {
  const signal = useSignal(runLoop(fn));

  useLayoutEffect(() => looper(() => {
    const result = runLoop(fn);
    if (result !== signal.value)
      signal.value = result;
  }));

  return signal;
};