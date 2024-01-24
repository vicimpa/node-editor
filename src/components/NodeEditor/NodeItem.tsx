import { createContext, createElement, ReactNode } from "react";
import { createPortal } from "react-dom";

import { useSignalRef } from "@/hooks/useSignalRef";
import { forward } from "@/utils/forward";
import { resizer } from "@/utils/resizer";
import { batch } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";

import s from "./NodeEditor.module.sass";
import { NodeListItem, useNodeItem } from "./NodeLIst";

type StartPpops = {
  id: string;
  x?: number;
  y?: number;
};

export const NodeItemContext = createContext<NodeListItem | null>(null);
export type NodeItemProps<T extends object> = Omit<T, keyof StartPpops> & StartPpops;

export const makeNodeItem = <T extends object>(
  hoc: (
    props: NodeItemProps<T>,
    elem: NodeListItem
  ) => ReactNode
) => (
  (props: NodeItemProps<T>) => {
    const elem = useNodeItem(props.id, props.x, props.y);
    const ref = useSignalRef<HTMLDivElement>(null);

    useSignalEffect(() => {
      const { current: div } = ref;
      if (!div) return;
      return (
        resizer(div, () => (
          batch(() => {
            elem.width.value = div.offsetWidth;
            elem.height.value = div.offsetHeight;
          })
        ))
      );
    });

    return createElement(() => (
      useSignals(),
      elem.target.current &&
      createPortal(
        <NodeItemContext.Provider value={elem}>
          <div className={s.resizer}>
            <div ref={ref} className={s.target}>
              {createElement(() => hoc(props, elem))}
            </div>
          </div>
        </NodeItemContext.Provider>
        , elem.target.current
      )
    ));
  }
);

export const NodeItem = forward<'foreignObject', { children?: never; }>(
  (
    {
      className = '',
      ...props
    },
    _ref
  ) => <foreignObject className={`${s.item} ${className}`} ref={_ref} {...props} />
);