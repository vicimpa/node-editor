import { connect } from "@/decorators/connect";
import { useClass } from "@/hooks/useClass";
import { useSet } from "@/hooks/useSet";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeItemCtx, useNodeItem } from "../NodeItem";
import { NodeLinesCtx, useNodeLines } from "../NodeLines";
import { computeCorrect } from "./lib/computeCorrect";
import { computePosition } from "./lib/computePosition";
import { detectConnect } from "./lib/detectConnect";

@connect([
  detectConnect
])
export class NodePortCtx {
  ref = signalRef<HTMLSpanElement>();

  position = computed(() => computePosition(this));
  correct = computed(() => computeCorrect(this));

  title = signal('port');
  color = signal('#999');

  meta?: any;
  onConnect?: (ctx: NodePortCtx) => any;
  onDisconnect?: (ctx: NodePortCtx) => any;

  constructor(
    public id: string,
    public isOutput = false,
    public item: NodeItemCtx,
    public lines: NodeLinesCtx,
  ) { }

  static usePort(id: string, isOutput = false) {
    const item = useNodeItem();
    const lines = useNodeLines();
    const port = useClass(this, id, isOutput, item, lines);
    const list = isOutput ? item.output : item.input;
    return useSet(list, id, port, [id, port]);
  }
}