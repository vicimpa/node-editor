import { MouseEvent as ReactMouseEvent, useCallback } from "react";

import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";

import { useEvent } from "./useEvent";

export type TDragEvent = {
  start: Vec2;
  current: Vec2;
  delta: Vec2;
  target: EventTarget | null;
};

export type TDragStop = (e: TDragEvent) => void;
export type TDragMove = (e: TDragEvent) => void | TDragStop;
export type TDragStart = (e: TDragEvent) => void | TDragMove;

export const useDrag = (_dragStart: TDragStart, btn = 0) => {
  const dragStart = useEvent(_dragStart);

  return useCallback(
    (e: MouseEvent | ReactMouseEvent) => {
      if (e.button !== btn)
        return;

      e.preventDefault();
      e.stopPropagation();

      const start = Vec2.fromPageXY(e);
      const current = Vec2.fromPageXY(e);
      const delta = new Vec2();
      const event = {
        get start() { return start.clone(); },
        get current() { return current.clone(); },
        get delta() { return delta.clone(); },
        target: e.target
      };

      let move = dragStart(event);
      let stop: TDragStop | void;

      const unsub = [
        () => {
          move = undefined;
          stop = undefined;
        },
        windowEvent('mousemove', (e) => {
          Vec2.fromPageXY(e, current);
          delta.set(start).minus(current);
          stop = move?.(event);
        }),
        windowEvent(['mouseup', 'blur'], (e) => {
          if ('button' in e && e.button !== btn)
            return;

          stop?.(event);
          unsub.forEach(u => u());
        }),
      ];
    },
    []
  );
};