import {windowEvent} from "@/utils/events";
import {makeDrag} from "@/utils/makeDrag";
import {effect} from "@preact/signals-react";
import {NodeSelectionCtx} from "@/components/NodeEditor/components/NodeSelection/NodeSelectionCtx.ts";
import {looper} from "@/utils/looper.ts";
import {checkRectInRect} from "@/utils/checkInclude.ts";

export const detectDrag = (select: NodeSelectionCtx) => (
  effect(() => {
    const {selectFrom, selectTo, map, list} = select;

    const selection = makeDrag(({start, current}) => {
      map.animation.value = undefined
      const dispose = looper((_, dtime) => {
        map.calcViewTransitionVec(current, dtime).toSignals(map.x, map.y)
      })
      selectFrom.value = map.offset(start)

      return ({current: newCurrent}) => {
        current.set(newCurrent);
        selectTo.value = map.offset(newCurrent);
        return () => {
          if (selectFrom.value && selectTo.value) {
            const selectionZone = selectFrom.value.toRect(selectTo.value)
            list.list.forEach(elt => {
              if (checkRectInRect(elt.rect.value, selectionZone)) {
                console.log(elt.id)
              }
            })
          }
          dispose()
          selectTo.value = undefined;
          selectFrom.value = undefined;
        };
      }
    }, 0)

    return windowEvent('mousedown', (e) => {
      if (
        false
        || !(e.target instanceof Element)
      ) return;
      selection(e)
    });
  })
);