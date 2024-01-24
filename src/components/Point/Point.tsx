import { useId } from "react";

import { useForwardRef } from "@/hooks/useForwardRef";
import { forward } from "@/utils/forward";
import { v } from "@/utils/styleVar";

import s from "./Point.module.sass";

export type TPointParam = {
  name: string;
  color?: string;
  title?: string;
};

export type TPointProps = {
  id: string;
  name?: string;
  title?: string;
  color?: string;
  output?: boolean;
};

export const Point = forward<'div', TPointProps>(
  (
    {
      id,
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
    const subId = useId();
    const ref = useForwardRef(_ref);

    return (
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
          id={id + subId}
          className={s.dot}
          onMouseDown={e => console.log(e.currentTarget)}
          onMouseUp={e => console.log(e.currentTarget)}
        />
        <span className={s.text}>{name}</span>
      </div>
    );
  }
);