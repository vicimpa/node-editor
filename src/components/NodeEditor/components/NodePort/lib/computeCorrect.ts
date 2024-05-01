import { Vec2 } from "@/library/Vec2";
import { rectCenter } from "@/utils/domrect";

import { NodePortCtx } from "../";

export const computeCorrect = (port: NodePortCtx) => {
  const { current: span } = port.ref;
  const { item } = port;
  const { map } = item;

  if (!span)
    return new Vec2();

  item.width.value;
  item.height.value;

  return map.offset(
    rectCenter(span.getBoundingClientRect())
  ).minus(item.x, item.y);
};