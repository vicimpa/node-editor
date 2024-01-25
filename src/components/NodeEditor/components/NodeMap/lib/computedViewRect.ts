import { NodeMapCtx } from "../";

export const computedViewRect = (map: NodeMapCtx) => {
  const { value: x } = map.left;
  const { value: y } = map.top;
  const { value: width } = map.width;
  const { value: height } = map.height;
  return new DOMRect(x, y, width, height);
};