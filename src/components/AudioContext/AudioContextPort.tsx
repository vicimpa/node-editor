import { FC } from "react";

import { NodePort } from "../NodeEditor";
import { BasePort } from "./library/BasePort";

export const AudioContextPort: FC<{ port: BasePort; }> = ({ port }) => {
  return (
    <NodePort
      id={port.id}
      output={port.output}
      title={port.title}
      color={port.color}
      meta={port}
      onConnect={e => {
        return port.onConnect(e.meta);
      }}
      onDisconnect={e => {
        return port.onDisconnect(e.meta);
      }} />
  );
};