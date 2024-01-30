import { FC, useEffect, useId } from "react";

import { NodePortCtx } from "./NodePortCtx";

export type NodePortProps = {
  id?: string;
  title?: string;
  color?: string;
  output?: boolean;
};

export const NodePort: FC<NodePortProps> = ({ id, output, title, color }) => {
  const reserveId = useId();
  const port = NodePortCtx.usePort(id ?? reserveId, output);

  useEffect(() => {
    port.title.value = title ?? port.title.peek();
    port.color.value = color ?? port.color.peek();
  }, [port, title, color]);

  return null;
};
