import {MouseEvent as ReactMouseEvent} from "react";

import {connect} from "@/decorators/connect";
import {Vec2} from "@/library/Vec2";
import {classContext} from "@/utils/classContext";
import {rectCenter} from "@/utils/domrect.ts";
import {fv, TFV} from "@/utils/fv";
import {cropSize, minMax} from "@/utils/math";
import {signalCorrect} from "@/utils/signalCorrect";
import {signalRef} from "@/utils/signalRef";
import {computed, signal} from "@preact/signals-react";

//import {computedRect} from "./lib/computedRect";
import {computedViewRect} from "./lib/computedViewRect";
import {detectCursor} from "./lib/detectCursor";
import {detectDrag} from "./lib/detectDrag";
import {detectMoved} from "./lib/detectMoved";
import {detectResize} from "./lib/detectResize";
import {detectWheel} from "./lib/detectWheel";

@connect([
  detectCursor,
  detectDrag,
  detectMoved,
  detectResize,
  detectWheel,
])
export class NodeMapCtx {
  xLimit = 10000;
  yLimit = 10000;

  scaleMin = .1
  scaleMax = 5

  div = signalRef<HTMLDivElement>();
  svg = signalRef<SVGSVGElement>();

  x = signalCorrect(0, v => cropSize(v, this.xLimit, .5));
  y = signalCorrect(0, v => cropSize(v, this.yLimit, .5));
  scale = signalCorrect(1, v => minMax(v, this.scaleMin, this.scaleMax));

  top = signal(0);
  left = signal(0);
  width = signal(0);
  height = signal(0);

  move = signal(false);

  rect = computed(() => this.computedRect());
  viewRect = computed(() => computedViewRect(this));
  cursor = computed(() => this.move.value ? 'grabbing' : 'default');

  computedRect(
    x = this.x.value,
    y = this.y.value,
    s = this.scale.value
  ) {
    const {value: w} = this.width;
    const {value: h} = this.height;
    const size = new Vec2(w, h).div(s);
    const pos = size.cdiv(-2).plus(x, y);
    return new DOMRect(...pos, ...size);
  };

  offset(vec: Vec2 | MouseEvent | ReactMouseEvent): Vec2 {
    if (!(vec instanceof Vec2))
      return this.offset(Vec2.fromPageXY(vec));

    const {value: rect} = this.rect;
    const {value: viewRect} = this.viewRect;
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