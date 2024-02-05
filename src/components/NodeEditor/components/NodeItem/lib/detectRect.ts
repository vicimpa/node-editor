import {effect} from "@preact/signals-react";

import {NodeItemCtx} from "../";

export const detectRect = (item: NodeItemCtx) => (
  effect(() => {
    const {current: ref} = item.ref;
    const {value: rect} = item.rect;
    if (!ref) return;
    ref.x.baseVal.value = rect.x;
    ref.y.baseVal.value = rect.y;
    ref.width.baseVal.value = rect.width;
    ref.height.baseVal.value = rect.height;
  })
);