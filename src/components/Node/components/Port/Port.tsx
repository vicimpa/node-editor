import { FC } from "react";

import { NodePortCtx } from "@/components/NodeEditor";
import { compute } from "@/utils/compute";
import { v } from "@/utils/styleVar";

import s from "./Port.module.sass";

export type PortProps = {
  ctx: NodePortCtx;
};

export const Port: FC<PortProps> = ({ ctx }) => {
  const { color, title, isOutput } = ctx;

  return (
    <>
      {
        compute(() => (
          <div
            className={s.port}
            key="port"
            data-output={isOutput || undefined}
            style={{ [v`color`]: color.value }}
          >
            <span
              ref={ctx.ref}
              className={s.circle} />
            <span>{title}</span>
          </div>
        ))
      }
    </>
  );
};