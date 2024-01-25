import { createContext, useContext, useLayoutEffect, useMemo } from "react";

import { Vec2 } from "@/library/Vec2";
import { cropSize, minMax } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { computedRect } from "./lib/computedRect";
import { computedViewRect } from "./lib/computedViewRect";
import { detectCursor } from "./lib/detectCursor";
import { detectMoved } from "./lib/detectMoved";
import { detectResize } from "./lib/detectResize";

const Context = createContext<NodeMapCtx | null>(null);

export class NodeMapCtx {
  xLimit = 10000;
  yLimit = 10000;

  div = signalRef<HTMLDivElement>();
  svg = signalRef<SVGSVGElement>();

  x = signalCorrect(0, v => cropSize(v, this.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.yLimit, .5));

  top = signal(0);
  left = signal(0);
  width = signal(0);
  height = signal(0);

  scale = signalCorrect(1, v => minMax(v, .1, 5));
  rect = computed(() => computedRect(this));
  viewRect = computed(() => computedViewRect(this));

  cursor = signal('default');

  offset(vec: Vec2) {
    const { value: rect } = this.rect;
    const { value: viewRect } = this.viewRect;
    const size = Vec2.fromSize(rect);
    const viewSize = Vec2.fromSize(viewRect);
    const scale = viewSize.cdiv(size);
    return vec.cminus(viewRect).div(scale).plus(rect);
  }

  connect() {
    const dispose: Array<() => void> = [
      detectResize(this),
      detectMoved(this),
      detectCursor(this),
    ];

    return () => {
      dispose.forEach(dis => dis());
    };
  }

  static Provider = Context.Provider;

  static use(isCreate = false) {
    var ctx = useContext(Context);

    if (ctx) return ctx;
    if (!isCreate) throw new Error('You need NodeMap context');

    ctx = useMemo(() => new this(), []);
    useLayoutEffect(() => ctx?.connect(), []);
    return ctx;
  }
}