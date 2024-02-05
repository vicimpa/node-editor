import { FC } from "react";

import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";
import { forward } from "@/utils/forward";
import { Signal } from "@preact/signals-react";

import { useNodeLayers } from "../NodeLayers";
import { NodePortCtx } from "../NodePort";
import s from "./NodeLines.module.sass";
import { Path2DString } from "@/library/Path2DString.ts";

export type LinesItemProps = {
  from: NodePortCtx;
  to?: NodePortCtx;
  vec?: Signal<Vec2 | null>;
};

const getPath = (f: Vec2, t: Vec2, asing: number, bsign = asing) => {
  const path = new Path2DString();
  const dist = f.cminus(t).abs().div(2, 4).cropMax(250, 50);
  const stepA = f.cplus(dist.ctimes(asing, 0));
  const stepB = t.cminus(dist.ctimes(bsign, 0));
  return path.moveTo(f).cubicBezierCurve(stepA, stepB, t.cplus(0, 0.0001)).toString();
};

export const LinesItem: FC<LinesItemProps> = forward<'path', LinesItemProps>(
  ({vec, from, to}, ref) => {
    const {Portal} = useNodeLayers();

    if (to)
      return (
        <Portal isBefore>
          {
            compute(() => {
              const {position: {value: _f}, color: {value: colorFrom}, isOutput, id: idFrom} = from;
              const {position: {value: _t}, color: {value: colorTo}, id: idTo} = to;
              const gradientId = `from-${idFrom}-to-${idTo}`;

              return (
                <>
                  <linearGradient
                    id={gradientId}
                    x1={`${_f.x < _t.x ? 0 : 100}%`} y1="0%"
                    x2={`${_f.x > _t.x ? 0 : 100}%`} y2="0%"
                  >
                    <stop offset="0%" style={{stopColor: colorFrom, stopOpacity: 1}}/>
                    <stop offset="100%" style={{stopColor: colorTo, stopOpacity: 1}}/>
                  </linearGradient>
                  <path
                    d={getPath(_f, _t, isOutput ? 1 : -1)}
                    stroke={`url(#${gradientId})`}
                    className={s.line}
                    ref={ref}
                    strokeWidth={5}
                    fill="transparent"/>
                </>
              );
            })
          }
        </Portal>
      );

    if (vec)
      return (
        <Portal isBefore>
          {
            compute(() => {
              const {value: _f} = from.position;
              const {value: _t} = vec;

              if (!_t)
                return null;

              return (
                <path
                  d={getPath(_f, _t, from.isOutput ? 1 : -1, 0)}
                  stroke="#666"
                  fill="none"
                  strokeWidth={5}/>
              );
            })
          }
        </Portal>
      );

    return null;
  }
);