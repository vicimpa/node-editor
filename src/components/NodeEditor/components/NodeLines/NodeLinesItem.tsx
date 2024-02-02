import { FC } from "react";

import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";
import { Signal } from "@preact/signals-react";

import { useNodeLayers } from "../NodeLayers";
import { NodePortCtx } from "../NodePort";

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
            const { value: _f } = from.position;
            const { value: _t } = to.position;

            return (
              <line
                x1={_f.x}
                y1={_f.y}
                x2={_t.x}
                y2={_t.y}
                stroke="#fff"
                strokeWidth={5} />
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
              <line
                x1={_f.x}
                y1={_f.y}
                x2={_t.x}
                y2={_t.y}
                stroke="#fff"
                strokeWidth={5} />
            );
          })
        }
      </Portal>
    );

  return null;
};