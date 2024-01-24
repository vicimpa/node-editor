export const rectToString = ({ x, y, width: w, height: h }: DOMRect) => (
  `${x} ${y} ${w} ${h}`
);