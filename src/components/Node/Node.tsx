import { createElement, ReactNode } from "react";

import { useSelection } from "@/components/NodeEditor/components/NodeSelection/lib/useSelection.ts";
import { useSubEmit } from "@/hooks/useSubEmit";
import { compute } from "@/utils/compute.ts";
import { v } from "@/utils/styleVar";
import { useComputed } from "@preact/signals-react";

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
                  useSubEmit(item.input)
                    .map((ctx, key) => (
                      <Port {...{ ctx, key }} />
                    ))
                ))
              }
            </div>
            <div className={s.output}>
              {
                createElement(() => (
                  useSubEmit(item.output)
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