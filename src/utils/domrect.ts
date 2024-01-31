import { Vec2 } from "@/library/Vec2";

import { minMax } from "./math";

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
  new DOMRect(
    a.x + (b.x - a.x) * i,
    a.y + (b.y - a.y) * i,
    a.width + (b.width - a.width) * i,
    a.height + (b.height - a.height) * i,
  )
);