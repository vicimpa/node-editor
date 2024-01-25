import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";

import { NodeMapCtx } from "../";

export const detectMouse = (map: NodeMapCtx) => (
  windowEvent('mousemove', (e) => (
    map.mouse.value = Vec2.fromPageXY(e)
  ))
);