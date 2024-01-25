import { resizer } from "@/utils/resizer";
import { batch, effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectResize = (map: NodeMapCtx) => (
  effect(() => (
    map.div.current &&
    resizer(map.div.current, () => (
      batch(() => {
        const rect = map.div.current!.getBoundingClientRect();
        map.left.value = rect.left;
        map.top.value = rect.top;
        map.width.value = rect.width;
        map.height.value = rect.height;
      })
    ))
  ))
);