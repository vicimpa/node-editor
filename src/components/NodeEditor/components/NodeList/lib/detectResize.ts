import {batch, effect} from "@preact/signals-react";

import {NodeListCtx} from "../";

export const detectResize = (list: NodeListCtx) => (
  effect(() => {
    list.itemsCount.value;

    list.list.forEach(v => {
      v.x.value;
      v.y.value;
      v.width.value;
      v.height.value;
    });

    if (list.ref.current)
      batch(() => {
        const bbox = list.ref.current?.getBBox()!;
        list.x.value = bbox.x ?? 0;
        list.y.value = bbox.y ?? 0;
        list.width.value = bbox.width ?? 0;
        list.height.value = bbox.height ?? 0;
      });
  })
);