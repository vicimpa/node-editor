import equal from "fast-deep-equal";

import { BaseObserver } from "./BaseObserver";

export type BoundingRectObserverHandler = (
  (entries: BoundingRectObserverEntry[]) => any
);

export class BoundingRectObserverEntry extends DOMRect {
  constructor(
    { x, y, width, height }: DOMRect,
    public target: Element,
    public time: number,
  ) {
    super(x, y, width, height);
  }
}

export class BoundingRectObserver extends BaseObserver<
  Element,
  DOMRect,
  BoundingRectObserverEntry
> {
  constructor(callback: BoundingRectObserverHandler) {
    super(
      (elem) => elem.getBoundingClientRect(),
      (a, b) => equal(a?.toJSON(), b.toJSON()),
      (...args) => (
        new BoundingRectObserverEntry(...args)
      ),
      callback
    );
  }
}