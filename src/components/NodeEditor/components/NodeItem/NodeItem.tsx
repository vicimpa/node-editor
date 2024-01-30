import { FC } from "react";

import { useConnect } from "@/hooks/useConnect";

import { NodeItemCtx } from "./";
import s from "./NodeItem.module.sass";

export type NodeItemProps = {
  ctx: NodeItemCtx;
};

export const NodeItem: FC<NodeItemProps> = ({ ctx }) => (
  useConnect(ctx),
  <foreignObject id={ctx.id} ref={ctx.ref} className={s.foregin}>
    <div className={s.container}>
      <div ref={ctx.div} className={s.resizer} />
    </div>
  </foreignObject>
);