import { NodeSelectionCtx } from "@/components/NodeEditor/components/NodeSelection/NodeSelectionCtx.ts";
import { windowEvent } from "@/utils/events";
import { looper } from "@/utils/looper.ts";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";
import { iDOMRect, NODE_MARGIN } from "@/library/DOMRect.ts";

export const detectDrag = (select: NodeSelectionCtx) => (
  effect(() => {
    const { selectFrom, selectTo, list } = select;
    const { map } = list;

    const selection = makeDrag(({ start, current }) => {
      map.animation.value = undefined;
      selectFrom.value = map.offset(start);

      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime)
          .toSignals(map.x, map.y);

        selectTo.value = map.offset(current);
      });

      return ({ current: newCurrent }) => {
        current.set(newCurrent);

        return () => {
          if (selectFrom.value && selectTo.value) {
            const zone = new iDOMRect(selectFrom.value, selectTo.value);
            list.list.forEach(elt => {
              if (zone.wrapRect(elt.rect.value, { margin: NODE_MARGIN })) {
                select.toSelection(elt, true);
              }
            });
          }

          dispose();
          selectTo.value = undefined;
          selectFrom.value = undefined;
        };
      };
    }, 0);

    return windowEvent('mousedown', (e) => {
      if (
        false
        || !(e.target instanceof Element)
        || e.target !== map.svg.current
      ) return;
      if (!e.shiftKey)
        select.clearSelection();
      selection(e);
    });
  })
);