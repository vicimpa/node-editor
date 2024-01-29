import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";
import { effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectWheel = (map: NodeMapCtx) => (
  effect(() => {
    const { scale, x, y, move } = map;
    const { current: svg } = map.svg;
    const { current: div } = map.div;

    if (!div || !svg) return;

    return windowEvent('wheel', (e) => {
      if (
        false
        || move.value
        || !(e.target instanceof Element)
        || !div.contains(e.target)
      ) return;

      e.preventDefault();
      e.stopPropagation();

      if (!e.ctrlKey) {
        const delta = Vec2.fromDeltaXY(e);

        if (e.shiftKey && !delta.x)
          delta.inverse();

        delta
          .div(scale)
          .plus(x, y)
          .toSignals(x, y);

        return;
      }

      const mouse = Vec2.fromPageXY(e);
      const start = map.offset(mouse);
      scale.value -= e.deltaY * .001;
      start.minus(map.offset(mouse));
      start.plus(x, y);
      start.toSignals(x, y);
    });
  })
);