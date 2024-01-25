import { classContext } from "@/utils/classContext";
import { cropSize } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeListCtx, NodeMapCtx } from "../../";
import { computedRect } from "./lib/computedRect";
import { detectDrag } from "./lib/detectDrag";
import { detectRect } from "./lib/detectRect";
import { detectResize } from "./lib/detectResize";

export class NodeItemCtx {
  ref = signalRef<SVGForeignObjectElement>();
  div = signalRef<HTMLDivElement>();

  x = signalCorrect(0, v => cropSize(v, this.map.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.map.yLimit, .5));

  width = signal(0);
  height = signal(0);

  rect = computed(() => computedRect(this));

  focus() {
    this.list.focus(this);
  }

  constructor(
    public id: string,
    public map: NodeMapCtx,
    public list: NodeListCtx
  ) { }

  connect() {
    const dispose: Array<() => void> = [
      detectResize(this),
      detectRect(this),
      detectDrag(this),
    ];

    return () => {
      dispose.forEach(dis => dis());
    };
  }
}

export const [
  NodeItemProvider,
  useNodeItem
] = classContext(NodeItemCtx);