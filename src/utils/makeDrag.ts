import { MouseEvent as ReactMouseEvent } from "react";

import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";

export type TDragEvent = {
  start: Vec2;
  current: Vec2;
  delta: Vec2;
  target: EventTarget | null;
};

export type TDragStop = (e: TDragEvent) => void;
export type TDragMove = (e: TDragEvent) => void | TDragStop;
export type TDragStart = (e: TDragEvent) => void | TDragMove;

export const makeDrag = (
  dragStart: TDragStart,
  btn = 0
) => (e: MouseEvent | ReactMouseEvent) => {
  if (e.button !== btn)
    return;

  e.preventDefault();
  e.stopPropagation();

  const start = Vec2.fromPageXY(e);
  const current = start.clone();
  const delta = new Vec2(0);

  const event = {
    get start() { return start.clone(); },
    get current() { return current.clone(); },
    get delta() { return delta.clone(); },
    target: e.target
  };

  const update = () => {
    if (!move) return;
    stop = move(event);
  };

  let move = dragStart(event);
  let stop: TDragStop | void;

  update();

  const unsub = [
    windowEvent(['mouseup', 'blur'], (e) => {
      if ('button' in e && e.button !== btn)
        return;

      stop?.(event);
      unsub.forEach(u => u?.());
    }),
    windowEvent('mousemove', (e) => {
      Vec2.fromPageXY(e, current);
      delta.set(start).minus(current);
      update();
    }),
    () => {
      move = undefined;
      stop = undefined;
    }
  ];
};