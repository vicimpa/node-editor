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
      const offset = map.offset(start);
      const correct = Vec2.fromSignals(x, y)
        .minus(offset);

      const others = [...item.selection.items]
        .filter(e => e !== item);

      const othersCorrect = others
        .map(e => (
          Vec2.fromSignals(e.x, e.y)
            .minus(offset)
        ));

      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime)
          .toSignals(map.x, map.y);

        const offset = map.offset(current);

        correct
          .cplus(offset)
          .toSignals(x, y);

        othersCorrect.forEach((correct, i) => {
          const { x, y } = others[i];

          correct.cplus(offset)
            .toSignals(x, y);
        });
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
      item.selection.toSelection(item, e.ctrlKey || e.metaKey);

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