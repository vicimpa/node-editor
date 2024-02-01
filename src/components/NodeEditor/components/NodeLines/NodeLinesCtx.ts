import { connect } from "@/decorators/connect";
import { ReactiveSet } from "@/library/ReactiveSet";
import { Vec2 } from "@/library/Vec2";
import { classContext } from "@/utils/classContext.ts";
import { signal } from "@preact/signals-react";

import { NodeMapCtx } from "../NodeMap";
import { NodePortCtx } from "../NodePort";
import { detectMouse } from "./lib/detectMouse";
import { detectMouseUp } from "./lib/detectMouseUp";

export class NodeLinesItem {
  to?: NodePortCtx;

  constructor(public from: NodePortCtx) { }
}

@connect([
  detectMouse,
  detectMouseUp
])
export class NodeLinesCtx {
  map!: NodeMapCtx;

  list = new ReactiveSet<NodeLinesItem>();

  mouse = signal<Vec2 | null>(null);
  active = signal<NodeLinesItem | null>(null);

  from(target: NodePortCtx) {
    this.active.value = new NodeLinesItem(target);
  }

  to(target: NodePortCtx) {
    const active = this.active.peek();

    if (!active)
      return;

    if (target !== active.from && target.item !== active.from.item && target.isOutput !== active.from.isOutput) {
      active.to = target;
      this.list.add(active);
    }

    this.active.value = null;
    this.mouse.value = null;
  }
}

export const [
  NodeLinesProvider,
  useNodeLines
] = classContext(NodeLinesCtx);