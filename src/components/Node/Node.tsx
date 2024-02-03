import {createElement, ReactNode} from "react";

import {v} from "@/utils/styleVar";

import {makeNodeItem, useNodeItem} from "../NodeEditor";
import {Port} from "./components/Port";
import s from "./Node.module.sass";
import {useNodeSelection} from "@/components/NodeEditor/components/NodeSelection";

export type TNodeProps = {
  title?: string;
  color?: string;
  children?: ReactNode;
};

export const Node = makeNodeItem<TNodeProps>(
  (
    {
      title = 'Unnamed',
      color = '#999',
      children,
    }
  ) => {
    const item = useNodeItem();
    const {items} = useNodeSelection()
    // const selectionStyles = useComputed(() => {
    //   items.use()
    //   return items.has(item.id) ? {borderColor: "#08f"} : {}
    // })
    const selectionStyles =
      items.use().has(item.id) ? {borderColor: "#08f"} : {}

    return (
      <div className={s.node} style={{[v`color`]: color, ...selectionStyles}}>
        <div data-drag onDoubleClick={() => {
          item.map.focus(item.rect.value);
        }} className={s.head}>
          <span className={s.text}>
            {title}
          </span>
        </div>
        <div className={s.content}>
          <div className={s.pins}>
            <div className={s.input}>
              {
                createElement(() => (
                  item.input.use()
                    .map((ctx, key) => (
                      <Port {...{ctx, key}} />
                    ))
                ))
              }
            </div>
            <div className={s.output}>
              {
                createElement(() => (
                  item.output.use()
                    .map((ctx, key) => (
                      <Port {...{ctx, key}} />
                    ))
                ))
              }
            </div>
          </div>
          <div className={s.center}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);