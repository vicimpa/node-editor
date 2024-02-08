import { MiniMapCtx } from "@/components/MiniMap/MiniMapCtx.ts";
import { Vec2 } from "@/library/Vec2.ts";
import { refEvent } from "@/utils/events.ts";
import { looper } from "@/utils/looper.ts";
import { makeDrag } from "@/utils/makeDrag.ts";
import { effect } from "@preact/signals-react";

export const detectDrag = (item: MiniMapCtx) => (
  effect(() => {
    const { current: ref } = item.canvas;
    const { list, width, height } = item;
    const { map } = list;

    if (!ref) return;

    const drag = makeDrag(({ current }) => {
      map.animation.value = undefined;

      const mapWidth = map.xLimit;
      const scale = mapWidth / width;
      const mapSizeCorrect = new Vec2(width, height).div(2);

      const dispose = looper(() => {
        current.cminus(mapSizeCorrect).times(scale).toSignals(map.x, map.y);
      });

      return ({ current: newCurrent }) => {
        current.set(newCurrent);
        return dispose;
      };

    }, 0, true);

    return refEvent(item.canvas, 'mousedown', (e) => {
      if (
        false
        || e.button
        || !(e.target instanceof Element)
      ) return;

      drag(e);
    });
  })
);