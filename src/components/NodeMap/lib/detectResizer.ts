import { resizer } from "@/utils/resizer";
import { batch, effect } from "@preact/signals-react";

import { NodeMapCtx } from "../";

export const detectResizer = (map: NodeMapCtx) => (
  effect(() => (
    map.div.value &&
    resizer(map.div.value, ({ contentRect }) => (
      batch(() => {
        map.width.value = contentRect.width;
        map.height.value = contentRect.height;
      })
    ))
  ))
);