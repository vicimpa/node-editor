import { Vec2 } from "@/library/Vec2";

export const offsetSvgVec = (base: Element, svg: DOMRect | SVGSVGElement, vec: Vec2) => {
  if (svg instanceof SVGSVGElement)
    svg = svg.viewBox.baseVal;

  const rect = base.getBoundingClientRect();
  const scale = Vec2.fromSize(rect).div(svg.width, svg.height);
  return vec.cminus(rect).div(scale).cplus(svg);
};