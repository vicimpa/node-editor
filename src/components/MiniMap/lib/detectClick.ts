import { effect } from "@preact/signals-react";
import { refEvent } from "@/utils/events.ts";
import { MiniMapCtx } from "@/components/MiniMap/MiniMapCtx.ts";
import { Vec2 } from "@/library/Vec2.ts";
import { makeDrag } from "@/utils/makeDrag.ts";
import { looper, runLoop } from "@/utils/looper.ts";
import { minMax } from "@/utils/math.ts";

export const detectDrag = (item: MiniMapCtx) => (
  effect(() => {
    const { current: ref } = item.canvas;
    const { list, width, height } = item;
    const { map } = list;

    const drag = makeDrag(({ current }) => {
      map.animation.value = undefined;
      const mapWidth = map.xLimit;
      const scale = mapWidth / width;
      const mapSizeCorrect = new Vec2(width, height).div(2);

      const startTime = runLoop(t => t);
      const lengthtime = 500;

      const start = Vec2.fromSignals(map.x, map.y);
      const end = current.cminus(mapSizeCorrect).times(scale);

      const dispose = looper(() => {
        current.cminus(mapSizeCorrect).times(scale).toSignals(map.x, map.y);
      });

      const calc = (delta = 0) => {
        delta = minMax(delta, 0, 1);
        start.cplus(end.cminus(start).times(delta)).toSignals(map.x, map.y);
      };

      map.animation.value = (time) => {
        calc((time - startTime) / lengthtime);
        return startTime + lengthtime > time;
      };

      return ({ current: newCurrent }) => {
        if (!current.equal(newCurrent))
          map.animation.value = undefined;
        current.set(newCurrent);

        return () => {
          dispose();
        };
      };

    }, 0, true);

    return refEvent(item.canvas, 'mousedown', (e) => {
      if (
        false
        || e.button
        || !(e.target instanceof Element)
      ) return;

      if (!ref) return;

      drag(e);
    });
  })
);