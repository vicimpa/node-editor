import { FC, useLayoutEffect } from "react";

import { NodeItemCtx } from "./";
import s from "./NodeItem.module.sass";

export type NodeItemProps = {
  ctx: NodeItemCtx;
};

export const NodeItem: FC<NodeItemProps> = ({ ctx }) => (
  useLayoutEffect(() => ctx.connect(), [ctx]),
  <foreignObject id={ctx.id} ref={ctx.ref} className={s.foregin}>
    <div className={s.container}>
      <div ref={ctx.div} className={s.resizer} />
    </div>
  </foreignObject>
);