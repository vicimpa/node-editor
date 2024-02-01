import { FC } from "react";

import { NodePortCtx, useNodeLayers, useNodeMap } from "@/components/NodeEditor";
import { useDrag } from "@/hooks/useDrag";
import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";
import { v } from "@/utils/styleVar";
import { useSignal } from "@preact/signals-react";

import s from "./Port.module.sass";

export type PortProps = {
  ctx: NodePortCtx;
};

export const Port: FC<PortProps> = ({ ctx }) => {
  const { color, title, isOutput, ref, position } = ctx;
  const map = useNodeMap();
  const lineEnd = useSignal(new Vec2());
  const show = useSignal(false);
  const { Portal } = useNodeLayers();

  const drag = useDrag(({ current }) => {
    show.value = true;
    lineEnd.value = map.offset(current);

    return ({ current }) => {
      lineEnd.value = map.offset(current);

      return () => {
        show.value = false;
      };
    };
  });

  return (
    <>
      {
        compute(() => (
          <div
            className={s.port}
            data-output={isOutput || undefined}
            style={{ [v`color`]: color.value }}
          >
            <span ref={ref} onMouseDown={drag} className={s.circle} />
            <span>{title}</span>
          </div>
        ))
      }
      {
        compute(() => (
          show.value && (
            <Portal isBefore>
              {
                compute(() => (
                  <line
                    x1={position.value.x}
                    y1={position.value.y}
                    x2={lineEnd.value.x}
                    y2={lineEnd.value.y}
                    stroke="#fff"
                    strokeWidth={5}
                    fill="none" />
                ))
              }
            </Portal>
          )
        ))
      }
    </>
  );
};