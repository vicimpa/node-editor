import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";
import { looper } from "@/utils/looper";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";

import { NodeItemCtx } from "../";

export const detectDrag = (item: NodeItemCtx) => (
  effect(() => {
    const { current: ref } = item.ref;
    const { current: div } = item.div;
    const { map, x, y } = item;

    if (!ref || !div) return;

    const drag = makeDrag(({ start, current }) => {
      const correct = Vec2.fromSignals(x, y)
        .minus(map.offset(start));

      const dispose = looper(() => {
        correct
          .cplus(map.offset(current))
          .toSignals(x, y);
      });

      return ({ current: newCurrent }) => {
        current.set(newCurrent);
        return dispose;
      };
    });

    return windowEvent('mousedown', (e) => {
      if (
        false
        || e.button
        || !(e.target instanceof Element)
        || !div.contains(e.target)
      ) return;

      item.focus();

      for (const elem of div.querySelectorAll('[data-drag]')) {
        if (elem === e.target || elem.contains(e.target)) {
          return drag(e);
        }
      }
    });
  })
);