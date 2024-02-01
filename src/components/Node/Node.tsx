import { createElement, ReactNode } from "react";

import { v } from "@/utils/styleVar";

import { makeNodeItem, useNodeItem } from "../NodeEditor";
import { Port } from "./components/Port";
import s from "./Node.module.sass";

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

    return (
      <div className={s.node} style={{ [v`color`]: color }}>
        <div data-drag onDoubleClick={() => {
          item.map.focus(item.rect.value);
        }} className={s.head}>
          <span className={s.text}>
            {title}
          </span>
          <button>+</button>
        </div>
        <div className={s.content}>
          <div className={s.pins}>
            <div className={s.input}>
              {
                createElement(() => (
                  item.input.use()
                    .map((ctx, key) => (
                      <Port {...{ ctx, key }} />
                    ))
                ))
              }
            </div>
            <div className={s.output}>
              {
                createElement(() => (
                  item.output.use()
                    .map((ctx, key) => (
                      <Port {...{ ctx, key }} />
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