import { NodeListCtx } from "../";

export const computedRect = (list: NodeListCtx) => {
  const { value: x } = list.x;
  const { value: y } = list.y;
  const { value: w } = list.width;
  const { value: h } = list.height;
  return new DOMRect(x, y, w, h);
};