import { createElement, FC, ReactNode, RefObject, useMemo } from "react";
import { createPortal } from "react-dom";

import { useSignalRef } from "@/hooks/useSignalRef";
import { forward } from "@/utils/forward";
import { resizer } from "@/utils/resizer";
import { batch, Signal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";

import { NodeMapCtx, useNodeMap } from "./";
import s from "./NodeEditor.module.sass";
import { useNodeItem } from "./NodeLIst";

export type TSubProps = {
  map: NodeMapCtx;
  target: RefObject<SVGForeignObjectElement>;
  focus(): void;
  x: Signal<number>;
  y: Signal<number>;
  width: Signal<number>;
  height: Signal<number>;
};

type StartPpops = {
  x?: number;
  y?: number;
};

export type NodeItemProps<T extends object> = Omit<T, keyof StartPpops> & StartPpops;

export const makeNodeItem = <T extends object>(
  hoc: (props: NodeItemProps<T>, subProps: TSubProps) => ReactNode
): FC<NodeItemProps<T>> => {
  const Func: FC<{ props: NodeItemProps<T>; } & { subProps: TSubProps; }> = ({
    subProps,
    props
  }) => hoc(props, subProps);

  return (props) => {
    const { target, x, y, width, height, focus } = useNodeItem(props.x, props.y);
    const ref = useSignalRef<HTMLDivElement>(null);
    const map = useNodeMap();
    const subProps = useMemo(() => ({
      map, focus, target, x, y, width, height
    }), [target, map, focus, x, y, width, height]);

    useSignalEffect(() => {
      const { current: div } = ref;
      if (!div) return;
      return (
        resizer(div, () => (
          batch(() => {
            width.value = div.offsetWidth;
            height.value = div.offsetHeight;
          })
        ))
      );
    });

    return (
      <>
        {
          createElement(
            () => {
              useSignals();
              if (!target.current)
                return null;

              return createPortal(
                <div className={s.resizer}>
                  <div ref={ref} className={s.target}>
                    <Func
                      subProps={subProps}
                      props={props} />
                  </div>
                </div>
                , target.current
              );
            }
          )
        }
      </>
    );
  };
};

export const NodeItem = forward<'foreignObject', { children?: never; }>(
  (
    {
      className = '',
      ...props
    },
    _ref
  ) => <foreignObject className={`${s.item} ${className}`} ref={_ref} {...props} />
);