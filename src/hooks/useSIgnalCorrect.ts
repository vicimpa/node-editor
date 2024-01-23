import { useMemo } from "react";
import { signalCorrect } from "~/utils/signalCorrect";

import { useSignal } from "@preact/signals-react";

import { useEvent } from "./useEvent";

export const useSignalCorrect = <T>(
  val: T,
  _correct: (val: T) => T
) => {
  const signal = useSignal(_correct(val));
  const correct = useEvent(_correct);
  return useMemo(() => signalCorrect(signal, correct), []);
};