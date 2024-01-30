import {Vec2} from "@/library/Vec2";

export const rectToString = (rect: DOMRect) => (
  `${rect.x} ${rect.y} ${rect.width} ${rect.height}`
);

export const rectCenter = (rect: DOMRect | HTMLElement): Vec2 => {
  if (rect instanceof HTMLElement)
    return rectCenter(rect.getBoundingClientRect());

  return Vec2.fromSize(rect).div(2).plus(rect);
};