import {Vec2} from "@/library/Vec2";
import {windowEvent} from "@/utils/events";
import {makeDrag} from "@/utils/makeDrag";
import {effect} from "@preact/signals-react";

import {NodeMapCtx} from "../";

export const detectDrag = (map: NodeMapCtx) => (
  effect(() => {
    const {x, y, scale, move} = map;
    const {current: ref} = map.div;
    const {current: div} = map.svg;

    if (!ref || !div) return;

    const drag = makeDrag(({start}) => (
      map.animation.value = undefined,
        move.value = true,
        start = Vec2.fromSignals(x, y),
        ({delta}) => {
          delta
            .div(scale)
            .plus(start)
            .toSignals(x, y);

          return () => {
            move.value = false;
          };
        }
    ), 1);
    
    return windowEvent('mousedown', (e) => {
      if (
        false
        || !(e.target instanceof Element)
        || !div.contains(e.target)
      ) return;

      drag(e);
    });
  })
);