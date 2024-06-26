import {Vec2} from "@/library/Vec2";
import {windowEvent} from "@/utils/events";
import {effect} from "@preact/signals-react";

import {NodeLinesCtx} from "../";


export const detectMouse = (lines: NodeLinesCtx) => (
  effect(() => {
    const {value: active} = lines.active;
    if (!active) return;
    const {map} = lines

    return windowEvent('mousemove', (e) => {
      lines.mouse.value = map.offset(Vec2.fromPageXY(e))
    });
  })
);