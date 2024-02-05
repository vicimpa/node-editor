import {Vec2} from "@/library/Vec2";

import {iters, minMax} from "./math";

export const rectToString = (rect: DOMRect) => (
  `${rect.x} ${rect.y} ${rect.width} ${rect.height}`
);

export const rectCenter = (rect: DOMRect | HTMLElement): Vec2 => {
  if (rect instanceof HTMLElement)
    return rectCenter(rect.getBoundingClientRect());

  return Vec2.fromSize(rect).div(2).plus(rect);
};

export const rectIters = (a: DOMRect, b: DOMRect, i: number): DOMRect => (
  i = minMax(i, 0, 1),
    i = 1 - (1 - i) * (1 - i),
    new DOMRect(
      iters(a.x, b.x, i),
      iters(a.y, b.y, i),
      iters(a.width, b.width, i),
      iters(a.height, b.height, i),
    )
);

//TODO мб перенести в расчет rect item?
const NODE_MARGIN = 20
export const checkRectInRect = (rect: DOMRect, zone: DOMRect) => {
  const {x: xRect, y: yRect, height: hRect, width: wRect} = rect
  const {x: xZone, y: yZone, height: hZone, width: wZone} = zone
  return (
    xRect + NODE_MARGIN >= xZone &&
    yRect + NODE_MARGIN >= yZone &&
    xRect + wRect - NODE_MARGIN <= xZone + wZone &&
    yRect + hRect - NODE_MARGIN <= yZone + hZone
  )
}