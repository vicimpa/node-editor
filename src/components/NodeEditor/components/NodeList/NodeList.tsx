import { createElement, FC, ReactNode } from "react";

import { NodeItem } from "../NodeItem";
import { NodeListCtx } from "./";

export type NodeListProps = {
  children?: ReactNode;
};

export const NodeList: FC<NodeListProps> = ({ children }) => {
  const ctx = NodeListCtx.use(true);

  return (
    <NodeListCtx.Provider value={ctx}>
      {children}

      <g ref={ctx.ref}>
        {
          createElement(() => (
            ctx.list.use()
              .map((ctx, key) => (
                <NodeItem key={key} ctx={ctx} />
              ))
          ))
        }
      </g>
    </NodeListCtx.Provider>

  );
};