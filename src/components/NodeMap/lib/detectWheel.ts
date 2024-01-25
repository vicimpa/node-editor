import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";

import { NodeMapCtx } from "../";

export const detectWheel = (map: NodeMapCtx) => (
  windowEvent('wheel', (event) => {
    const { current: div } = map.div;
    const { current: svg } = map.svg;
    const { x, y, scale } = map;
    const { offsetMouse } = map;
    const { target } = event;

    if (
      false
      || !div
      || !svg
      || !(target instanceof Node)
      || !div.contains(target)
    ) return;

    event.preventDefault();
    event.stopPropagation();

    if (!event.ctrlKey) {
      const delta = Vec2.fromDeltaXY(event);

      if (event.shiftKey && !delta.x)
        delta.inverse();

      delta.div(scale).plus(x, y).toSignals(x, y);
      return;
    }

    const { value: start } = offsetMouse;
    scale.value -= event.deltaY * .001;
    start.cminus(offsetMouse.value)
      .plus(x, y)
      .toSignals(x, y);
  })
);