import { createContext, useContext, useLayoutEffect, useMemo } from "react";

import { Vec2 } from "@/library/Vec2";
import { cropSize, minMax } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { computed, signal } from "@preact/signals-react";

import { computedOffset } from "./lib/computedOffset";
import { computedRect } from "./lib/computedRect";
import { detectCursor } from "./lib/detectCursor";
import { detectMouse } from "./lib/detectMouse";
import { detectMoved } from "./lib/detectMoved";
import { detectResizer } from "./lib/detectResizer";
import { detectWheel } from "./lib/detectWheel";

const Context = createContext<NodeMapCtx | null>(null);

export class NodeMapCtx {
  xLimit = 10000;
  yLimit = 10000;

  div = signalRef<HTMLDivElement>();
  svg = signalRef<SVGSVGElement>();

  x = signalCorrect(0, v => cropSize(v, this.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.yLimit, .5));

  width = signal(0);
  height = signal(0);

  scale = signalCorrect(1, v => minMax(v, .1, 5));
  rect = computed(() => computedRect(this));

  cursor = signal('default');

  mouse = signal(new Vec2());
  offsetMouse = computed(() => computedOffset(this));

  connect() {
    const dispose: Array<() => void> = [
      detectResizer(this),
      detectMoved(this),
      detectMouse(this),
      detectWheel(this),
      detectCursor(this),
    ];

    return () => {
      dispose.forEach(dis => dis());
    };
  }

  static Provider = Context.Provider;
  static use() {
    var ctx = useContext(Context);

    if (ctx) return ctx;

    ctx = useMemo(() => new this(), []);
    useLayoutEffect(() => ctx?.connect(), []);
    return ctx;
  }
}