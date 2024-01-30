import { connect } from "@/decorators/connect";
import { useClass } from "@/hooks/useClass";
import { useSet } from "@/hooks/useSet";
import { signalRef } from "@/utils/signalRef";
import { signal } from "@preact/signals-react";

import { NodeItemCtx, useNodeItem } from "../NodeItem";

@connect([])
export class NodePortCtx {
  ref = signalRef<HTMLSpanElement>();

  title = signal('port');
  color = signal('#999');

  constructor(
    public id: string,
    public isOutput = false,
    public item: NodeItemCtx,
  ) { }

  static usePort(id: string, isOutput = false) {
    const item = useNodeItem();
    const port = useClass(this, id, isOutput, item);
    const list = isOutput ? item.output : item.input;
    return useSet(list, id, port, [id, port]);
  }
}