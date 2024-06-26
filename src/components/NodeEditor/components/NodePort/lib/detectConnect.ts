import { dispose } from "@/utils/dispose";
import { refEvent } from "@/utils/events";
import { looper } from "@/utils/looper.ts";
import { makeDrag } from "@/utils/makeDrag.ts";
import { effect } from "@preact/signals-react";

import { NodePortCtx } from "../";

export const detectConnect = (port: NodePortCtx) => (
  effect(() => {
    if (!port.ref.current)
      return;
    const { lines } = port;
    const { map } = lines;

    const moveView = makeDrag(({ current }) => {
      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime).toSignals(map.x, map.y);
        lines.mouse.value = map.offset(current);
      });
      return ({ current: newCurrent }) => {
        current.set(newCurrent);
        return dispose;
      };
    });

    return dispose([
      refEvent(port.ref, 'mousedown', (e) => {
        port.lines.from(port);
        return moveView(e);
      }),
      refEvent(port.ref, 'mouseup', () => {
        port.lines.to(port);
      })
    ]);
  })
);