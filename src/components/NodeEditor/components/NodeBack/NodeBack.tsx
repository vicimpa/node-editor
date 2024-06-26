import { MouseEventHandler } from "react";

import { useVariID } from "@/hooks/useVariId";
import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";

import { useNodeMap } from "../..";
import { CircleBack } from "./lib/CircleBack";
import { ClearBack } from "./lib/ClearBack";
import { CustomBack } from "./lib/CustomBack";
import s from "./NodeBack.module.sass";

const patterns = {
  'circle': CircleBack,
  'custom': CustomBack,
  'clear': ClearBack,
} as const;

type PATTERNS = typeof patterns;

type PATTERN_KEY = keyof PATTERNS;

type PARAMS_OBJECT<T extends PATTERN_KEY> = (
  Parameters<PATTERNS[T]>[0]
);

type PARAMS<T extends PATTERN_KEY> = (
  PARAMS_OBJECT<T> extends object ? (
    PARAMS_OBJECT<T>
  ) : {}
);

type BASE_PROPS = {
  width?: number;
  height?: number;
  anchorX?: number;
  anchorY?: number;
  onClick?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  back?: Omit<
    JSX.IntrinsicElements['rect'],
    'x' | 'y' | 'width' | 'height'
  >;
};

export type NodeBackProps<T extends PATTERN_KEY> = (
  { type: T; } & BASE_PROPS & PARAMS<T>
);

export const NodeBack = <T extends PATTERN_KEY>({
  type, width:
  pw = 50,
  height:
  ph = 50,
  anchorX = 0.5,
  anchorY = 0.5,
  back,
  onClick,
  onMouseDown,
  onContextMenu,
  ...params
}: NodeBackProps<T>) => {
  const ctx = useNodeMap();
  const { xLimit: width, yLimit: height } = ctx;
  const id = useVariID('back');
  const { x, y } = new Vec2(width, height).times(-anchorX);
  const { x: px, y: py } = new Vec2(pw, ph).times(-anchorY);

  return (
    <>
      <defs>
        <pattern
          id={id}
          viewBox={`${px} ${py} ${pw} ${ph}`}
          width={pw}
          height={ph}
          patternUnits="userSpaceOnUse"
        >
          {compute(() => patterns[type](params))}
        </pattern>
      </defs>

      <g >
        {back && (
          <rect
            className={s.back}
            x={x} y={y}
            width={width} height={height}
            {...back} />
        )}

        <rect
          className={s.back}
          x={x} y={y}
          width={width} height={height}
          fill={`url(#${id})`} />
      </g>
    </>
  );
};