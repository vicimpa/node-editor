import { resizer } from "@/utils/resizer";
import { batch, effect } from "@preact/signals-react";

import { NodeItemCtx } from "../";

export const detectResize = (item: NodeItemCtx) => (
  effect(() => (
    item.div.current &&
    resizer(item.div.current, ({ contentRect }) => (
      batch(() => {
        item.width.value = contentRect.width;
        item.height.value = contentRect.height;
      })
    ))
  ))
);