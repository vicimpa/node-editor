import { connect } from "@/decorators/connect";
import { Vec2 } from "@/library/Vec2";
import { classContext } from "@/utils/classContext.ts";
import { signal } from "@preact/signals-react";

import { NodeMapCtx } from "../NodeMap";
import { NodePortCtx } from "../NodePort";
import { ConnectList } from "./ConnectList";
import { detectMouse } from "./lib/detectMouse";
import { detectMouseUp } from "./lib/detectMouseUp";

@connect([
  detectMouse,
  detectMouseUp
])
export class NodeLinesCtx {
  map!: NodeMapCtx;

  list = new ConnectList(this);

  mouse = signal<Vec2 | null>(null);
  active = signal<NodePortCtx | null>(null);

  from(target: NodePortCtx) {
    this.active.value = target;
  }

  to(target: NodePortCtx) {
    const active = this.active.peek();

    if (active)
      this.list.connect(active, target);

    this.active.value = null;
    this.mouse.value = null;
  }
}

export const [
  NodeLinesProvider,
  useNodeLines
] = classContext(NodeLinesCtx);