import { useEffect, useId, useMemo } from "react";

import { ReactiveMap } from "@/library/ReactiveMap";
import { classContext } from "@/utils/classContext";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeItemCtx } from "../NodeItem";
import { NodeList } from "./";
import { computedRect } from "./lib/computedRect";
import { detectResize } from "./lib/detectResize";

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

  connect() {
    const dispose: Array<() => void> = [
      detectResize(this)
    ];

    return () => {
      dispose.forEach(dis => dis());
    };
  }

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
    id = id ?? reserveId

    const item = useMemo(() => (
        new NodeItemCtx(id, this.map, this)
    ), [id]);

    useEffect(() => (
      this.list.set(id, item),
      () => { this.list.delete(id); }
    ), [id, item]);

    return item;
  }
}

export const [
  NodeListProvider,
  useNodeList
] = classContext(NodeListCtx);