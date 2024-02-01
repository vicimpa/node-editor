import { Vec2 } from "@/library/Vec2";

import { iters, minMax } from "./math";

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