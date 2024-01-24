import { ReactNode } from "react";

import { Signal } from "@preact/signals-react";

import { compute } from "./compute";

export const fixed = (n: number | Signal<number>, toFix = 2): ReactNode => (
  n instanceof Signal ? (
    compute(() => fixed(n.value, toFix))
  ) : (
    n.toFixed(toFix)
  )
); 