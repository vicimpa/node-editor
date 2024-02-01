import {Vec2} from "@/library/Vec2";
import {refEvent} from "@/utils/events";
import {looper} from "@/utils/looper";
import {makeDrag} from "@/utils/makeDrag";
import {effect} from "@preact/signals-react";

import {NodeItemCtx} from "../";

export const detectDrag = (item: NodeItemCtx) => (
  effect(() => {
    const {current: ref} = item.ref;
    const {current: div} = item.div;
    const {map, x, y, fixed, height} = item;

    const drag = makeDrag<HTMLElement>(({start, current, meta}) => {
      const correct = Vec2.fromSignals(x, y)
        .minus(map.offset(start));
      // const mapRect = map.rect.peek();
      const viewRect = map.rect.value;
      const viewSize = Vec2.fromSize(viewRect);
      const halfView = viewSize.cdiv(2)

      const dispose = looper(() => {
        const centerElt = correct
          .cplus(map.offset(current))

        centerElt
          .toSignals(x, y);

        const rightPadding = map.x.value + halfView.x - centerElt.x
        const leftPadding = map.x.value - halfView.x - centerElt.x
        const topPadding = map.y.value - halfView.y - (centerElt.y - height.peek() / 2)
        const bottomPadding = map.y.value + halfView.y - (centerElt.y)

        const speeds = {
          1: 1,
          2: 3,
          3: 5
        }
        const incLimits = {
          1: 10,
          2: 50,
          3: 100
        }
        const decrLimits = {
          1: 150,
          2: 100,
          3: 50
        }
        const getThresholdValue = (level: 1 | 2 | 3, direction: "inc" | "decr") => {
          const limit = direction === "inc" ? incLimits[level] : decrLimits[level]
          return limit / map.scale.peek()
        }
        const getSpeed = (level: 1 | 2 | 3, direction: "inc" | "decr") => direction === "inc" ? speeds[level] : -speeds[level]

        const viewMove = (paddingInc: number, paddingDecr: number, axis: "x" | "y",
                          // direction: "inc" | "decr"
        ) => {
          if (paddingInc < getThresholdValue(3, "inc"))
            map[axis].value += getSpeed(3, "inc")
          else if (paddingInc < getThresholdValue(2, "inc"))
            map[axis].value += getSpeed(2, "inc")
          else if (paddingInc < getThresholdValue(1, "inc"))
            map[axis].value += getSpeed(1, "inc")

          if (paddingDecr > getThresholdValue(3, "decr"))
            map[axis].value += getSpeed(3, "decr")
          else if (paddingDecr > getThresholdValue(3, "decr"))
            map[axis].value += getSpeed(2, "decr")
          else if (paddingDecr > getThresholdValue(3, "decr"))
            map[axis].value += getSpeed(1, "decr")
        }

        viewMove(rightPadding, leftPadding, "x")
        viewMove(bottomPadding, topPadding, "y")

        if (fixed.peek()) {
          centerElt.toSignals(map.x, map.y);
        }
      });

      return ({current: newCurrent}) => {
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