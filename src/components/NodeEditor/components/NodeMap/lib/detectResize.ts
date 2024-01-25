import { resizer } from "@/utils/resizer";
import { batch, effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectResize = (map: NodeMapCtx) => (
  effect(() => (
    map.div.current &&
    resizer(map.div.current, ({ contentRect }) => (
      batch(() => {
        map.left.value = contentRect.left;
        map.top.value = contentRect.top;
        map.width.value = contentRect.width;
        map.height.value = contentRect.height;
      })
    ))
  ))
);