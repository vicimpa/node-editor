import { FC, ReactNode } from "react";

import { useDiff } from "@/hooks/useDiff";

import { useNodeList } from "../NodeList";
import { NodeItemProvider } from "./";

export type BaseNodeItemProps = {
  id?: string;
  x?: number;
  y?: number;
};

export const makeNodeItem = <T extends object>(
  HOC: (
    props: Omit<T, 'id' | 'x' | 'y'>
  ) => ReactNode
): FC<BaseNodeItemProps & T> => ({
  id,
  x = 0,
  y = 0,
  ...props
}) => {
    const ctx = useNodeList().useItem(id);

    useDiff({ x, y }, (diff) => {
      for (const _key in diff) {
        const key = _key as keyof typeof diff;
        ctx[key].value = diff[key] ?? ctx[key].peek();
      }
    });

    return (
      <NodeItemProvider value={ctx}>
        <ctx.Portal>
          <HOC {...props} />
        </ctx.Portal>
      </NodeItemProvider>
    );
  };