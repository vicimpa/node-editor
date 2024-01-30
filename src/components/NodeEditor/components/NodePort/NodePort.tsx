import { FC, useId } from "react";

import { useDiff } from "@/hooks/useDiff";

import { NodePortCtx } from "./NodePortCtx";

export type NodePortProps = {
  id?: string;
  title?: string;
  color?: string;
  output?: boolean;
};

export const NodePort: FC<NodePortProps> = ({ id, output, ...props }) => {
  const reserveId = useId();
  const port = NodePortCtx.usePort(id ?? reserveId, output);

  useDiff(props, (diff) => {
    for (const _key in diff) {
      const key = _key as keyof typeof diff;
      port[key].value = diff[key] ?? port[key].peek();
    }
  });

  return null;
};
