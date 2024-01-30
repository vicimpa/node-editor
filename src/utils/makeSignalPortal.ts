import { createElement, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

import { useSignals } from "@preact/signals-react/runtime";

export type SignalPortalProps = {
  children?: ReactNode;
};


export const makeSignalPortal = (
  <T extends Element>(signal: RefObject<T>) => (
    ({ children }: SignalPortalProps) => (
      createElement(() => (
        useSignals(),
        signal.current &&
        createPortal(children, signal.current)
      ))
    )
  )
);