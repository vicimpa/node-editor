import {
    NodeSelectionCtx
} from "@/components/NodeEditor/components/NodeSelection/NodeSelectionCtx.ts";
import { checkRectInRect } from "@/utils/domrect.ts";
import { windowEvent } from "@/utils/events";
import { looper } from "@/utils/looper.ts";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";

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
            const selectionZone = selectFrom.value.toRect(selectTo.value);

            list.list.forEach(elt => {
              if (checkRectInRect(elt.rect.value, selectionZone)) {
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
      ) return;
      select.clearSelection();
      selection(e);
    });
  })
);