import { subscribe } from "@/utils/reactive";
import { batch, effect, signal } from "@preact/signals-react";

import { NodeListCtx } from "../";

export const detectResize = (list: NodeListCtx) => (
  effect(() => {
    const size = signal(0);
    const dis = subscribe(list.list, () => size.value = list.list.size);

    for (const [, value] of list.list) {
      value.x.value;
      value.y.value;
    }

    if (list.ref.current)
      batch(() => {
        const bbox = list.ref.current?.getBBox()!;
        list.x.value = bbox.x ?? 0;
        list.y.value = bbox.y ?? 0;
        list.width.value = bbox.width ?? 0;
        list.height.value = bbox.height ?? 0;
      });

    return () => {
      dis();
    };
  })
);