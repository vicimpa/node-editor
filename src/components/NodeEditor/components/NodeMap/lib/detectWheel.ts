import {Vec2} from "@/library/Vec2";
import {refEvent} from "@/utils/events";

import {NodeMapCtx} from "../";
import {sign} from "@/utils/math.ts";

export const detectWheel = (map: NodeMapCtx) => (
  refEvent(map.div, 'wheel', (e) => {
    const {scale, x, y, move} = map;

    if (move.value) return;

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
    map.toScale(v => v - sign(e.deltaY) * v * .1, mouse);
  })
);