import { createElement, ReactNode } from "react";

import { useSignals } from "@preact/signals-react/runtime";

export const compute = (func: () => ReactNode): ReactNode => (
  createElement(() => (
    useSignals(),
    func()
  ))
);