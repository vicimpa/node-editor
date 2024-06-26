import { FC, ReactNode, useEffect } from "react";

import { batch } from "@preact/signals-react";

import { useNodeList } from "../NodeList";
import { NodeItemProvider } from "./";

export type BaseNodeItemProps = {
  id?: string;
  x?: number;
  y?: number;
  color?: string;
};

export const makeNodeItem = <T extends object>(
  HOC: (
    props: Omit<T, 'id' | 'x' | 'y' | "color">
  ) => ReactNode
): FC<BaseNodeItemProps & T> => ({
  id,
  x = 0,
  y = 0,
  color = "#999",
  ...props
}) => {
    const ctx = useNodeList().useItem(id);

    useEffect(() => batch(() => {
      ctx.x.value = x;
      ctx.y.value = y;
      ctx.color.value = color;
    }), [x, y, color]);

    return (
      <NodeItemProvider value={ctx}>
        <ctx.Portal>
          <HOC {...props} />
        </ctx.Portal>
      </NodeItemProvider>
    );
  };