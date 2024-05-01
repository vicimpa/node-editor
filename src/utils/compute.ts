import { createElement, FC, ReactNode } from "react";

import { useSignals } from "@preact/signals-react/runtime";

const Compute: FC<{ func: () => ReactNode; }> = ({ func }) => {
  useSignals();
  return func();
};

export const compute = (func: () => ReactNode): ReactNode => (
  createElement(Compute, { func })
);

