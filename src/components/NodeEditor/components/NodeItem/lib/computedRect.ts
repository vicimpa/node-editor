import { Vec2 } from "@/library/Vec2";

import { NodeItemCtx } from "../NodeItemCtx";

export const computedRect = (item: NodeItemCtx) => {
  const { value: x } = item.x;
  const { value: y } = item.y;
  const { value: w } = item.width;
  const { value: h } = item.height;
  const size = new Vec2(w, h);
  const pos = size.cdiv(-2).plus(x, y);
  return new DOMRect(...pos, ...size);
};