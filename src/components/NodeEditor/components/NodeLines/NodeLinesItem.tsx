import { FC } from "react";

import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";
import { forward } from "@/utils/forward";
import { Signal } from "@preact/signals-react";

import { useNodeLayers } from "../NodeLayers";
import { NodePortCtx } from "../NodePort";

export type LinesItemProps = {
  from: NodePortCtx;
  to?: NodePortCtx;
  vec?: Signal<Vec2 | null>;
};

const getPath = (f: Vec2, t: Vec2, xsing: number) => {
  const dist = f.cminus(t).abs().div(2, 4).cropMax(250, 50);
  const signVec = new Vec2(xsing, 0);
  const stepA = f.cplus(dist.ctimes(signVec));
  const stepB = t.cminus(dist.ctimes(signVec));
  return [`M${f}`, `C${stepA} ${stepB} ${t}`].join(' ');
};

export const LinesItem: FC<LinesItemProps> = forward<'path', LinesItemProps>(
  ({ vec, from, to }, ref) => {
    const { Portal } = useNodeLayers();

    if (to)
      return (
        <Portal isBefore>
          {
            compute(() => {
              const { position: { value: _f }, color: { value: colorFrom }, isOutput, id: idFrom } = from;
              const { position: { value: _t }, color: { value: colorTo }, id: idTo } = to;
              const gradientId = `from-${idFrom}-to-${idTo}`;

              return (
                <>
                  <linearGradient
                    id={gradientId}
                    x1={`${_f.x < _t.x ? 0 : 100}%`} y1="0%"
                    x2={`${_f.x > _t.x ? 0 : 100}%`} y2="0%"
                  >
                    <stop offset="0%" style={{ stopColor: colorFrom, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: colorTo, stopOpacity: 1 }} />
                  </linearGradient>
                  <path
                    d={getPath(_f, _t, isOutput ? 1 : -1)}
                    stroke={`url(#${gradientId})`}
                    ref={ref}
                    strokeWidth={5}
                    fill="transparent" />
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
              const { value: _f } = from.position;
              const { value: _t } = vec;

              if (!_t)
                return null;

              return (
                <path
                  d={getPath(_f, _t, from.isOutput ? 1 : -1)}
                  stroke="#666"
                  fill="none"
                  strokeWidth={5} />
              );
            })
          }
        </Portal>
      );

    return null;
  }
);