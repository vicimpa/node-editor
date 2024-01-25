import { effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectMoved = (map: NodeMapCtx) => (
  effect(() => {
    const { current: svg } = map.svg;
    const { value: rect } = map.rect;
    if (!svg) return;
    Object.assign(svg.viewBox.baseVal, rect.toJSON());
  })
);