import { FC, ReactNode } from "react";

import { NodeMapCtx } from "./";
import s from "./NodeMap.module.sass";

export type NodeMapProps = {
  children?: ReactNode;
};

export const NodeMap: FC<NodeMapProps> = ({ children }) => {
  const ctx = NodeMapCtx.use();

  return (
    <NodeMapCtx.Provider value={ctx}>
      <div className={s.map} ref={ctx.div}>
        <svg ref={ctx.svg} viewBox="0 0 0 0">
          {children}
        </svg>
      </div>
    </NodeMapCtx.Provider>
  );
};