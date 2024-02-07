import { Signal } from "@preact/signals-react";
import { Vec2 } from "@/library/Vec2.ts";
import { iters, minMax } from "@/utils/math.ts";

type RectTuple = [x: number, y: number, width: number, height: number]
type RectObj = { x: number, y: number, width: number, height: number }
type RectSignalTuple = [x: Signal<number>, y: Signal<number>, width: Signal<number>, height: Signal<number>]
type VecTuple = [start: Vec2, end: Vec2]
type iParams = [iDOMRect] | [DOMRect] | RectTuple | [RectObj] | RectSignalTuple | VecTuple
type InRectOptions = {
  margin?: number
}
type TimeFunction = "linear" | "easy-in" | "ease-out" | "ease-in-out" | "ease" | "cubic-ease-in" | "cubic-ease-out"
type TimeFnsType = {
  [key in TimeFunction]: (t: number) => number
}
type IterOptions = {
  timeFunction: TimeFunction
}

// let Original = globalThis.DOMRect;
const rectKeys = ["x", "y", "width", "height"];
const timeFns: TimeFnsType = {
  linear: (t) => t,
  "easy-in": (t) => t * t,
  "ease-out": (t) => t * (2 - t),
  "ease-in-out": (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  "cubic-ease-in": (t) => t * t * t,
  "cubic-ease-out": (t) => (--t) * t * t + 1,
  "ease": (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

const getDOMRectTuple = (args: iParams): RectTuple => {
  const first = args[0];

  if (first instanceof Vec2 && args[1] instanceof Vec2) {
    const rect = first.toRect(args[1]);
    return [rect.x, rect.y, rect.width, rect.height];
  }

  if (first instanceof DOMRect) {
    return [first.x, first.y, first.width, first.height];
  }

  if (args.filter(v => typeof v === "number").length === 4) {
    return args as RectTuple;
  }

  if (args.filter(v => v instanceof Signal).length === 4) {
    const signalTuple = args as RectSignalTuple;
    return signalTuple.map(v => v.peek()) as RectTuple;
  }

  if (typeof first === "object" && Object.keys(first).filter(key => rectKeys.includes(key)).length === 4) {
    return Object.values(first as RectObj) as RectTuple;
  }

  throw new Error('Unknown format');
};

export class iDOMRect extends DOMRect {
  constructor(...args: iParams) {
    super(...getDOMRectTuple(args));
  }

  * [Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.width;
    yield this.height;
  }

  get start() {
    return new Vec2(this.left, this.top);
  }
  get end() {
    return new Vec2(this.right, this.bottom);
  }
  get size() {
    return new Vec2(this.width, this.height);
  }
  get topLeft() {
    return new Vec2(this.left, this.top);
  }
  get topRight() {
    return new Vec2(this.right, this.top);
  }
  get bottomLeft() {
    return new Vec2(this.left, this.bottom);
  }
  get bottomRight() {
    return new Vec2(this.right, this.bottom);
  }
  get tuple(): RectTuple {
    return getDOMRectTuple([this]);
  }
  get vecTuple(): VecTuple {
    return [this.topLeft, this.bottomRight];
  }

  private _checkInRect(_rect: iDOMRect | DOMRect, inThis: boolean, options?: InRectOptions) {
    const [zone, rect] = inThis ? [this, _rect] : [_rect, this];
    const { left: leftRect, top: topRect, bottom: bottomRect, right: rightRect } = rect;
    const { left: leftZone, top: topZone, bottom: bottomZone, right: rightZone } = zone;
    const margin = options?.margin || 0;
    return (
      leftRect + margin >= leftZone &&
      topRect + margin >= topZone &&
      bottomRect - margin <= bottomZone &&
      rightRect - margin <= rightZone
    );
  }
  inRect(rect: iDOMRect | DOMRect, options?: InRectOptions): boolean {
    return this._checkInRect(rect, false, options);
  }

  wrapRect(rect: iDOMRect | DOMRect, options?: InRectOptions) {
    return this._checkInRect(rect, true, options);
  }

  toString() {
    `${this.x} ${this.y} ${this.width} ${this.height}`;
  }

  center(): Vec2 {
    return Vec2.fromSize(this).div(2).plus(this);
  };

  iterTo(rect: DOMRect, i: number, options: IterOptions = { timeFunction: "linear" }): iDOMRect {
    i = minMax(i, 0, 1);
    const fn = timeFns[options.timeFunction];
    i = fn(i);
    return new iDOMRect(
      iters(this.x, rect.x, i),
      iters(this.y, rect.y, i),
      iters(this.width, rect.width, i),
      iters(this.height, rect.height, i),
    );
  }

  intersectRect(rect: iDOMRect | DOMRect): iDOMRect {
    const x = Math.max(this.left, rect.left);
    const y = Math.max(this.top, rect.top);
    const right = Math.min(this.right, rect.right);
    const bottom = Math.min(this.bottom, rect.bottom);
    const width = Math.max(0, right - x);
    const height = Math.max(0, bottom - y);
    return new iDOMRect(x, y, width, height);
  }

  intersects(rect: iDOMRect | DOMRect): boolean {
    return !(
      rect.left > this.right ||
      rect.right < this.left ||
      rect.top > this.bottom ||
      rect.bottom < this.top
    );
  }

  distanceTo(rect: iDOMRect | DOMRect): Vec2 {
    const dx = Math.max(rect.left - this.right, this.left - rect.right, 0);
    const dy = Math.max(rect.top - this.bottom, this.top - rect.bottom, 0);
    return new Vec2(dx, dy);
  }

  unionRect(rect: iDOMRect | DOMRect): iDOMRect {
    const x = Math.min(this.left, rect.left);
    const y = Math.min(this.top, rect.top);
    const right = Math.max(this.right, rect.right);
    const bottom = Math.max(this.bottom, rect.bottom);
    const width = right - x;
    const height = bottom - y;
    return new iDOMRect(x, y, width, height);
  }

  scale(sx: number, sy: number = sx): iDOMRect {
    const { x: centerX, y: centerY } = this.center();
    const width = this.width * sx;
    const height = this.height * sy;
    return new iDOMRect(centerX - width / 2, centerY - height / 2, width, height);
  }

  static fromParams(...args: iParams) {
    return new this(...args);
  }
}