import { Vec2 } from "@/library/Vec2";

import { NodeMapCtx } from "../";

export const computedOffset = (map: NodeMapCtx) => {
  const { value: mouse } = map.mouse;
  const { value: div } = map.div;
  const { value: viewrect } = map.rect;
  if (!div) return mouse.clone();
  const mainrect = div.getBoundingClientRect();
  const scale = Vec2.fromSize(mainrect).div(Vec2.fromSize(viewrect));
  return mouse.cminus(mainrect).div(scale).plus(viewrect);
};