import { Vec2 } from "@/library/Vec2";
import { refEvent } from "@/utils/events";
import { looper } from "@/utils/looper";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";

import { NodeItemCtx } from "../";

export const detectDrag = (item: NodeItemCtx) => (
  effect(() => {
    const { current: ref } = item.ref;
    const { current: div } = item.div;
    const { map, x, y } = item;

    const drag = makeDrag<HTMLElement>(({ start, current, meta }) => {
      const correct = Vec2.fromSignals(x, y)
        .minus(map.offset(start));

      const dispose = looper(() => {
        correct
          .cplus(map.offset(current))
          .toSignals(x, y);
      });

      return ({ current: newCurrent }) => {
        current.set(newCurrent);
        return () => {
          dispose();
          meta && (meta.dataset.drag = 'true');
        };
      };
    });

    return refEvent(item.div, 'mousedown', (e) => {
      if (
        false
        || e.button
        || !(e.target instanceof Element)
      ) return;

      if (!ref || !div) return;

      item.focus();

      for (const elem of div.querySelectorAll('[data-drag]')) {
        if (
          true
          && elem instanceof HTMLElement
          && (
            false
            || elem === e.target
            || elem.contains(e.target)
          )
        ) {
          elem.dataset.drag = 'move';
          return drag(e, elem);
        }
      }
    });
  })
);