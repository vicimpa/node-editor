import { FC, useEffect, useId } from "react";

import { useConnect } from "@/hooks/useConnect";

import { NodePortCtx } from "./NodePortCtx";

export type NodePortProps = {
  id?: string;
  title?: string;
  color?: string;
  output?: boolean;
  meta?: any;
  onConnect?: (ctx: NodePortCtx) => any;
};

export const NodePort: FC<NodePortProps> = ({ id, output, title, color, meta, onConnect }) => {
  const reserveId = useId();
  const port = NodePortCtx.usePort(id ?? reserveId, output);

  port.meta = meta;
  port.onConnect = onConnect;

  useEffect(() => {
    port.title.value = title ?? port.title.peek();
    port.color.value = color ?? port.color.peek();
  }, [port, title, color]);

  useConnect(port);

  return null;
};
