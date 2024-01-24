import { MouseEvent as ReactMouseEvent, useCallback, useContext } from "react";

import { NodeMapCtx } from "@/components/NodeEditor";
import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";

import { useEvent } from "./useEvent";

export type TDragEvent = {
  start: Vec2;
  offsetStart: Vec2;
  current: Vec2;
  offsetCurrent: Vec2;
  delta: Vec2;
  offsetDelta: Vec2;
  target: EventTarget | null;
};

export type TDragStop = (e: TDragEvent) => void;
export type TDragMove = (e: TDragEvent) => void | TDragStop;
export type TDragStart = (e: TDragEvent) => void | TDragMove;

export const useDrag = (
  _dragStart: TDragStart,
  btn = 0,
  offset?: (v: Vec2) => Vec2
) => {
  const dragStart = useEvent(_dragStart);
  const mapCtx = useContext(NodeMapCtx);
  offset = offset ?? mapCtx?.offset ?? ((v) => v.clone());

  return useCallback(
    (e: MouseEvent | ReactMouseEvent) => {
      if (e.button !== btn)
        return;

      e.preventDefault();
      e.stopPropagation();

      const start = Vec2.fromPageXY(e);
      const offsetStart = offset(start);
      const current = start.clone();
      const offsetCurrent = offsetStart.clone();
      const delta = new Vec2(0);
      const offsetDelta = new Vec2(0);
      const event = {
        get start() { return start.clone(); },
        get current() { return current.clone(); },
        get delta() { return delta.clone(); },
        get offsetStart() { return offsetStart.clone(); },
        get offsetCurrent() { return offsetCurrent.clone(); },
        get offsetDelta() { return offsetDelta.clone(); },
        target: e.target
      };

      let move = dragStart(event);
      let stop: TDragStop | void = move?.(event);

      const unsub = [
        windowEvent(['mouseup', 'blur'], (e) => {
          if ('button' in e && e.button !== btn)
            return;

          stop?.(event);
          unsub.forEach(u => u());
        }),
        windowEvent('mousemove', (e) => {
          Vec2.fromPageXY(e, current);
          delta.set(start).minus(current);
          offsetCurrent.set(offset(current));
          offsetDelta.set(offsetStart).minus(offsetCurrent);
          stop = move?.(event);
        }),
        () => {
          move = undefined;
          stop = undefined;
        },
      ];
    },
    []
  );
};