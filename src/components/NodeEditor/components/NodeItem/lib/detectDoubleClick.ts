import { refEvent } from "@/utils/events";
import { effect } from "@preact/signals-react";

import { NodeItemCtx } from "../";

export const detectDoubleClick = (item: NodeItemCtx) => (
  effect(() => {
    const { current: ref } = item.ref;
    const { current: div } = item.div;

    return refEvent(item.div, 'dblclick', (e) => {
      if (
        false
        || e.button
        || !(e.target instanceof Element)
      ) return;

      if (!ref || !div) return;

      for (const elem of div.querySelectorAll('[data-drag]')) {
        if (
          true
          && elem instanceof HTMLElement
          && (
            false
            || elem === e.target
            || elem.contains(e.target)
          )
        ) {
          elem.dataset.drag = 'move';
          item.list.map.focus(item.rect.value);
          return;
        }
      }
    });
  })
);