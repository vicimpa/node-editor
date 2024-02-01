import { looper } from "@/utils/looper";
import { effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectAnimation = (map: NodeMapCtx) => (
  effect(() => {
    const { value: animation } = map.animation;
    if (!animation) return;
    return looper((time, dtime) => {
      if (animation(time, dtime) === false)
        map.animation.value = undefined;
    });
  })
);