import {Vec2} from "@/library/Vec2";
import {windowEvent} from "@/utils/events";
import {effect} from "@preact/signals-react";

import {NodeLinesCtx} from "../";
import {looper} from "@/utils/looper.ts";
import {makeDrag} from "@/utils/makeDrag.ts";

export const detectMouse = (lines: NodeLinesCtx) => (
  effect(() => {
    const {value: active} = lines.active;
    if (!active) return;
    const {map} = lines

    const moveView = makeDrag(({current}) => {
      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime).toSignals(map.x, map.y)
      })
      return ({current: newCurrent}) => {
        current.set(newCurrent);
        return dispose
      };
    })

    return windowEvent(['mousedown', 'mousemove'], (e) => {
      if (e.type === "mousemove")
        lines.mouse.value = map.offset(Vec2.fromPageXY(e))
      else
        return moveView(e)
    });
  })
);