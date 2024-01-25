import { Vec2 } from "@/library/Vec2";

import { NodeMapCtx } from "../";

export const computedRect = (map: NodeMapCtx) => {
  const { value: x } = map.x;
  const { value: y } = map.y;
  const { value: s } = map.scale;
  const { value: w } = map.width;
  const { value: h } = map.height;
  const size = new Vec2(w, h).div(s);
  const pos = size.cdiv(-2).plus(x, y);
  return new DOMRect(...pos, ...size);
};