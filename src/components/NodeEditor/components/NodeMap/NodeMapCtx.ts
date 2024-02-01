import { MouseEvent as ReactMouseEvent } from "react";

import { connect } from "@/decorators/connect";
import { Vec2 } from "@/library/Vec2";
import { classContext } from "@/utils/classContext";
import { rectCenter } from "@/utils/domrect.ts";
import { fv, TFV } from "@/utils/fv";
import { runLoop } from "@/utils/looper";
import { cropSize, min, minMax } from "@/utils/math";
import { signalCorrect } from "@/utils/signalCorrect";
import { signalRef } from "@/utils/signalRef";
import { batch, computed, signal } from "@preact/signals-react";

import { computedRect } from "./lib/computedRect";
import { computedViewRect } from "./lib/computedViewRect";
import { detectAnimation } from "./lib/detectAnimation";
import { detectCursor } from "./lib/detectCursor";
import { detectDrag } from "./lib/detectDrag";
import { detectMoved } from "./lib/detectMoved";
import { detectResize } from "./lib/detectResize";
import { detectWheel } from "./lib/detectWheel";

@connect([
  detectCursor,
  detectDrag,
  detectMoved,
  detectResize,
  detectWheel,
  detectAnimation,
])
export class NodeMapCtx {
  xLimit = 10000;
  yLimit = 10000;

  scaleMin = .1;
  scaleMax = 2;

  div = signalRef<HTMLDivElement>();
  svg = signalRef<SVGSVGElement>();

  x = signalCorrect(0, v => cropSize(v, this.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.yLimit, .5));
  scale = signalCorrect(1, v => minMax(v, this.scaleMin, this.scaleMax));

  animation = signal<((time: number, dtime: number) => any) | undefined>(undefined);

  top = signal(0);
  left = signal(0);
  width = signal(0);
  height = signal(0);

  move = signal(false);

  rect = computed(() => computedRect(this));
  viewRect = computed(() => computedViewRect(this));
  cursor = computed(() => this.move.value ? 'grabbing' : 'default');

  focus(target: Vec2 | DOMRect, lengthtime = 500) {
    if (target instanceof Vec2)
      target = new DOMRect(target.x, target.y, this.width.peek(), this.height.peek());

    const start = Vec2.fromSignals(this.x, this.y);
    const startScale = this.scale.peek();
    const startTime = runLoop(t => t);
    const needScale = min(Vec2.fromSize(this.viewRect.value)
      .div(Vec2.fromSize(target).plus(100)).min(), this.scaleMax);

    const calc = (delta = 0) => {
      delta = minMax(delta, 0, 1);

      batch(() => {
        start
          .citers(rectCenter(target), 1 - (1 - delta) * (1 - delta))
          .toSignals(this.x, this.y);

        this.toScale(startScale + (needScale - startScale) * delta * delta);
      });
    };

    calc(0);
    this.animation.value = (time) => {
      calc((time - startTime) / lengthtime);
      return startTime + lengthtime > time;
    };
  }

  offset(vec: Vec2 | MouseEvent | ReactMouseEvent): Vec2 {
    if (!(vec instanceof Vec2))
      return this.offset(Vec2.fromPageXY(vec));

    const { value: rect } = this.rect;
    const { value: viewRect } = this.viewRect;
    const size = Vec2.fromSize(rect);
    const viewSize = Vec2.fromSize(viewRect);
    const scale = viewSize.cdiv(size);
    return vec.cminus(viewRect).div(scale).plus(rect);
  }

  toScale(newScale: TFV<number, [old: number]>, vec = rectCenter(this.viewRect.value)) {
    const start = this.offset(vec);
    this.scale.value = fv(newScale, this.scale.peek());
    start.minus(this.offset(vec));
    start.plus(this.x, this.y);
    start.toSignals(this.x, this.y);
  }
}

export const [
  NodeMapProvider,
  useNodeMap
] = classContext(NodeMapCtx);