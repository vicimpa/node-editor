import {dispose} from "@/utils/dispose";
import {refEvent} from "@/utils/events";
import {effect} from "@preact/signals-react";

import {NodePortCtx} from "../";
import {makeDrag} from "@/utils/makeDrag.ts";
import {looper} from "@/utils/looper.ts";

export const detectConnect = (port: NodePortCtx) => (
  effect(() => {
    if (!port.ref.current)
      return;
    const {lines} = port
    const {map} = lines

    const moveView = makeDrag(({current}) => {
      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime).toSignals(map.x, map.y)
        lines.mouse.value = map.offset(current);
      })
      return ({current: newCurrent}) => {
        current.set(newCurrent);
        return dispose
      };
    })

    return dispose([
      refEvent(port.ref, 'mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        port.lines.from(port);
        return moveView(e)
      }),
      refEvent(port.ref, 'mouseup', () => {
        port.lines.to(port);
      })
    ]);
  })
);