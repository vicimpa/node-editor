import { Vec2 } from "@/library/Vec2";
import { refEvent } from "@/utils/events";
import { looper } from "@/utils/looper";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";

import { NodeItemCtx } from "../";

const PAD = 50;
const OVER = 4;

export const detectDrag = (item: NodeItemCtx) => (
  effect(() => {
    const { current: ref } = item.ref;
    const { current: div } = item.div;
    const { map, x, y } = item;
    const { viewRect } = map;

    const drag = makeDrag<HTMLElement>(({ start, current, meta }) => {
      const correct = Vec2.fromSignals(x, y)
        .minus(map.offset(start));

      const dispose = looper((_, dtime) => {
        const min = new Vec2(viewRect.value);
        const max = Vec2.fromSize(viewRect.value).plus(min);

        Vec2.fromSignals(map.x, map.y)
          .plus(
            current
              .cminus(min).minus(PAD).cropMax(0).cropMin(-PAD * OVER)
              .plus(current.cminus(max).plus(PAD).cropMin(0).cropMax(PAD * OVER))
              .times(dtime * .01 / map.scale.value)
          )
          .toSignals(map.x, map.y);

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