import { FC } from "react";

import { NodePortCtx } from "@/components/NodeEditor";
import { v } from "@/utils/styleVar";
import { useSignals } from "@preact/signals-react/runtime";

import s from "./Port.module.sass";

export type PortProps = {
  ctx: NodePortCtx;
};

export const Port: FC<PortProps> = ({ ctx }) => {
  const { color, title, isOutput, ref } = ctx;
  useSignals();

  return (
    <div
      className={s.port}
      data-output={isOutput || undefined}
      style={{ [v`color`]: color.value }}
    >
      <span ref={ref} className={s.circle} />
      <span>{title.value}</span>
    </div>
  );
};