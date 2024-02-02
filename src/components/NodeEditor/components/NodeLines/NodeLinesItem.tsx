import {FC} from "react";

import {Vec2} from "@/library/Vec2";
import {compute} from "@/utils/compute";
import {Signal} from "@preact/signals-react";

import { useNodeLayers } from "../NodeLayers";
import { NodePortCtx } from "../NodePort";
import {abs, min} from "@/utils/math.ts";

export type LinesItemProps = {
  from: NodePortCtx;
  to?: NodePortCtx;
  vec?: Signal<Vec2 | null>;
};

export const LinesItem: FC<LinesItemProps> = ({ vec, from, to }) => {
  const { Portal } = useNodeLayers();

  if (to)
    return (
      <Portal isBefore>
        {
          compute(() => {
            const {position: {value: _f}, color: {value: colorFrom}, isOutput, id: idFrom} = from
            const {position: {value: _t}, color: {value: colorTo}, id: idTo} = to;
            const stepX = min(250, abs(_f.x - _t.x))
            const step = isOutput ? stepX : -stepX
            const gradientId = `from-${idFrom}-to-${idTo}`

            return (
              <>
                <linearGradient id={gradientId} x1={`${_f.x < _t.x ? 0 : 100}%`} y1="0%"
                                x2={`${_f.x > _t.x ? 0 : 100}%`} y2="0%">
                  <stop offset="0%" style={{stopColor: colorFrom, stopOpacity: 1}}/>
                  <stop offset="100%" style={{stopColor: colorTo, stopOpacity: 1}}/>
                </linearGradient>
                <path
                  d={`M ${_f.tuple.join(" ")} C ${_f.x + step} ${_f.y}, ${_t.x - step} ${_t.y}, ${_t.tuple.join(" ")}`}
                  stroke={`url(#${gradientId})`}
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
              <line
                x1={_f.x}
                y1={_f.y}
                x2={_t.x}
                y2={_t.y}
                stroke="#fff"
                strokeWidth={5}/>
            );
          })
        }
      </Portal>
    );

  return null;
};