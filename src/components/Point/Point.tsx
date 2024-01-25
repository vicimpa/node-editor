import { createElement } from "react";

import { useDrag } from "@/hooks/useDrag";
import { useForwardRef } from "@/hooks/useForwardRef";
import { useSignalRef } from "@/hooks/useSignalRef";
import { Vec2 } from "@/library/Vec2";
import { forward } from "@/utils/forward";
import { v } from "@/utils/styleVar";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

import { Line } from "../Line";
import { NodeListItem, useNodeMap } from "../NodeEditor";
import s from "./Point.module.sass";

export type TPointParam = {
  id: string;
  name: string;
  color?: string;
  title?: string;
};

export type TPointProps = {
  id: string;
  parent: NodeListItem;
  name?: string;
  title?: string;
  color?: string;
  output?: boolean;
};

export const Point = forward<'div', TPointProps>(
  (
    {
      id,
      parent,
      name = 'Unnamed',
      title,
      color = '#999',
      output = false,
      style = {},
      className = '',
      ...props
    },
    _ref
  ) => {
    const ref = useForwardRef(_ref);
    const { offset } = useNodeMap();
    const to = useSignal<Vec2 | null>(null);

    const drag = useDrag(() => {

      return ({ offsetCurrent }) => {
        if (!(to.value instanceof Vec2) || !to.value.equal(offsetCurrent))
          to.value = offsetCurrent;

        return () => {
          to.value = null;
        };
      };
    }, 0, offset);

    const spanRef = useSignalRef<HTMLSpanElement>(null);

    return (
      <>
        <div
          ref={ref}
          data-output={output || undefined}
          className={`${s.point} ${className}`}
          style={{
            [v`color`]: color
          }}
          {...props}
        >
          <span
            id={parent.id + '_' + id}
            className={s.dot}
            onMouseDown={drag}
            onMouseUp={() => console.log(parent, id)}
            ref={spanRef}
          />
          <span className={s.text}>{name}</span>
        </div>
        {
          createElement(() => (
            useSignals(),
            <Line from={{ parent, point: spanRef, call: output ? 1 : -1 }} to={to.value ?? undefined} />
          ))
        }
      </>
    );
  }
);