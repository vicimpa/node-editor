import { createContext, useContext, useId, useLayoutEffect, useMemo } from "react";

import { cropSize } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { NodeListCtx, NodeMapCtx } from "../../";
import { computedRect } from "./lib/computedRect";
import { detectRect } from "./lib/detectRect";
import { detectResize } from "./lib/detectResize";

const Context = createContext<NodeItemCtx | null>(null);

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
      detectRect(this)
    ];

    return () => {
      dispose.forEach(dis => dis());
    };
  }

  static Provider = Context.Provider;

  static use(id?: string) {
    var ctx = useContext(Context);
    var reserveId = useId();
    var list = NodeListCtx.use();
    var map = NodeMapCtx.use();

    if (ctx)
      return ctx;

    id = id ?? reserveId;

    if (list.list.has(id))
      return list.list.get(id)!;

    ctx = useMemo(() => (
      new this(id, map, list)
    ), [id, map, list])!;

    useLayoutEffect(() => {
      list.list.set(id, ctx!);
      return () => { list.list.delete(id); };
    }, [ctx]);

    return ctx;
  }
}