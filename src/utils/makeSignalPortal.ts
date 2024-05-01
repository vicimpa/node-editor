import { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

import { compute } from "./compute";

export type SignalPortalProps = {
  children?: ReactNode;
};


export const makeSignalPortal = (
  <T extends Element>(signal: RefObject<T>) => (
    ({ children }: SignalPortalProps) => (
      compute(() => (
        signal.current &&
        createPortal(children, signal.current)
      ))
    )
  )
);