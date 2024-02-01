import { Vec2 } from "@/library/Vec2";

import { NodePortCtx } from "../";

export const computePosition = (port: NodePortCtx) => (
  Vec2.fromSignals(port.item.x, port.item.y)
    .plus(port.correct.value)
);