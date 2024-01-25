import { createContext, useContext, useLayoutEffect, useMemo } from "react";

import { ReactiveMap } from "@/library/ReactiveMap";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeMapCtx } from "../..";
import { NodeItemCtx } from "../NodeItem";
import { computedRect } from "./lib/computedRect";
import { detectResize } from "./lib/detectResize";

const Context = createContext<NodeListCtx | null>(null);

export class NodeListCtx {
  ref = signalRef<SVGGElement>();

  list = new ReactiveMap<string, NodeItemCtx>();

  x = signal(0);
  y = signal(0);

  width = signal(0);
  height = signal(0);

  rect = computed(() => computedRect(this));

  constructor(
    public map: NodeMapCtx
  ) { }

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

  static Provider = Context.Provider;

  static use(isCreate = false) {
    var ctx = useContext(Context);
    var map = NodeMapCtx.use();

    if (ctx) return ctx;
    if (!isCreate) throw new Error('You need NodeList context');

    ctx = useMemo(() => new this(map), [map]);
    useLayoutEffect(() => ctx?.connect(), []);
    return ctx;
  }
}  