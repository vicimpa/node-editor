import { ReactNode } from "react";

import { connect } from "@/decorators/connect";
import { ReactiveMap } from "@/library/ReactiveMap";
import { classContext } from "@/utils/classContext";
import { makeSignalPortal } from "@/utils/makeSignalPortal";
import { cropSize } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeListCtx, NodeMapCtx, NodePortCtx } from "../../";
import { NodeSelectionCtx } from "../NodeSelection";
import { computedRect } from "./lib/computedRect";
import { detectDoubleClick } from "./lib/detectDoubleClick";
import { detectDrag } from "./lib/detectDrag";
import { detectRect } from "./lib/detectRect";
import { detectResize } from "./lib/detectResize";

export type NodeItemPortal = {
  children?: ReactNode;
};

//TODO мб перенести в расчет rect item?
export const NODE_MARGIN = 20;

@connect([
  detectResize,
  detectRect,
  detectDrag,
  detectDoubleClick
])
export class NodeItemCtx {
  ref = signalRef<SVGForeignObjectElement>();
  div = signalRef<HTMLDivElement>();

  x = signalCorrect(0, v => cropSize(v, this.map.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.map.yLimit, .5));
  color = signal("");

  width = signal(0);
  height = signal(0);

  move = signal(false);
  rect = computed(() => computedRect(this));

  input = new ReactiveMap<string, NodePortCtx>();
  output = new ReactiveMap<string, NodePortCtx>();

  focus() {
    this.list.focus(this);
  }

  constructor(
    public id: string,
    public map: NodeMapCtx,
    public list: NodeListCtx,
    public selection: NodeSelectionCtx,
  ) {
  }

  Portal = makeSignalPortal(this.div);
}

export const [
  NodeItemProvider,
  useNodeItem
] = classContext(NodeItemCtx);