import { mover } from "@/utils/mover";
import { batch, effect } from "@preact/signals-react";

import { NodeListCtx } from "../";

export const detectResize = (list: NodeListCtx) => (
  effect(() => {
    if (!list.ref.current)
      return;

    return mover(list.ref.current, () => {
      batch(() => {
        const bbox = list.ref.current?.getBBox()!;
        list.x.value = bbox.x ?? 0;
        list.y.value = bbox.y ?? 0;
        list.width.value = bbox.width ?? 0;
        list.height.value = bbox.height ?? 0;
      });
    });
  })
);