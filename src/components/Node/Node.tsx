import { createElement, ReactNode } from "react";
import { v } from "@/utils/styleVar";

import { makeNodeItem, useNodeItem } from "../NodeEditor";
import { Port } from "./components/Port";
import s from "./Node.module.sass";
import { useSelection } from "@/components/NodeEditor/components/NodeSelection/lib/useSelection.ts";
import { useComputed } from "@preact/signals-react";
import { compute } from "@/utils/compute.ts";

export type TNodeProps = {
  title?: string;
  color?: string;
  children?: ReactNode;
};

export const Node = makeNodeItem<TNodeProps>(
  (
    {
      title = 'Unnamed',
      children,
    }
  ) => {
    const item = useNodeItem();
    const isSelected = useSelection();
    const selectionStyles = useComputed(
      () => isSelected.value ? { borderColor: "#08f" } : {}
    );

    return compute(() => (
      <div className={s.node} style={{ [v`color`]: item.color.value, ...selectionStyles.value }}>
        <div data-drag className={s.head}>
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
    ));
  }
);