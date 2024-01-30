import { useId } from "react";

import { connect } from "@/decorators/connect";
import { useClass } from "@/hooks/useClass";
import { useSet } from "@/hooks/useSet";
import { ReactiveMap } from "@/library/ReactiveMap";
import { classContext } from "@/utils/classContext";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeItemCtx } from "../NodeItem";
import { NodeList } from "./";
import { computedRect } from "./lib/computedRect";
import { detectResize } from "./lib/detectResize";

@connect([detectResize])
export class NodeListCtx {
  ref = signalRef<SVGGElement>();

  get map() { return this.listElem.map; }

  list = new ReactiveMap<string, NodeItemCtx>();

  x = signal(0);
  y = signal(0);

  width = signal(0);
  height = signal(0);

  rect = computed(() => computedRect(this));

  constructor(public listElem: NodeList) { }

  focus(id: string | NodeItemCtx) {
    if (id instanceof NodeItemCtx)
      id = id.id;

    const item = this.list.get(id);

    if (item) {
      this.list.delete(id) &&
        this.list.set(id, item);
    }
  }

  useItem(id?: string) {
    const reserveId = useId();
    id = id ?? reserveId;

    const item = useClass(NodeItemCtx, id, this.map, this);
    return useSet(this.list, id, item, [id, item]);
  }
}

export const [
  NodeListProvider,
  useNodeList
] = classContext(NodeListCtx);