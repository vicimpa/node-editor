import { effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectCursor = (map: NodeMapCtx) => (
  effect(() => {
    const { current: svg } = map.svg;
    const { value: cursor } = map.cursor;
    if (!svg) return;
    svg.style.cursor = cursor;
  })
);