import {windowEvent} from "@/utils/events";
import {makeDrag} from "@/utils/makeDrag";
import {effect} from "@preact/signals-react";
import {NodeSelectionCtx} from "@/components/NodeEditor/components/NodeSelection/NodeSelectionCtx.ts";
import {looper} from "@/utils/looper.ts";
import {max, min} from "@/utils/math.ts";
import {Vec2} from "@/library/Vec2.ts";

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
          list.list.map(elt => {
            const start = new Vec2(elt.rect.value)
            const end = start.cplus(Vec2.fromSize(elt.rect.value))
            if (
              selectFrom.value && selectTo.value &&
              start.x >= min(selectFrom.value.x, selectTo.value.x) &&
              start.y >= min(selectFrom.value.y, selectTo.value.y) &&
              end.x <= max(selectFrom.value.x, selectTo.value.x) &&
              end.y <= max(selectFrom.value.y, selectTo.value.y)
            ) {
              console.log(elt.id)
            }
          })
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