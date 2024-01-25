import { MouseEvent as ReactMouseEvent, useCallback, useEffect } from "react";

import { useClass } from "@/hooks/useClass";
import { useEvent } from "@/hooks/useEvent";
import { Vec2 } from "@/library/Vec2";
import { windowEvent } from "@/utils/events";
import { looper } from "@/utils/looper";

import { NodeMapCtx } from "../";

export type DragOut = (e: DragEvent) => void;
export type DragMove = (e: DragEvent) => void | DragOut;
export type DragEnter = (e: DragEvent) => void | DragMove;
export type DragEvent = {
  start: Vec2;
  current: Vec2;
  delta: Vec2;
};

export const useDrag = (
  map: NodeMapCtx,
  drag: DragEnter,
  btn?: number
) => {
  const disposeList = useClass(Array<() => void>);
  const dragEnter = useEvent(drag);
  const { offsetMouse } = map;

  const start = useClass(Vec2, offsetMouse.value);
  const current = useClass(Vec2, offsetMouse.value);
  const delta = useClass(Vec2, 0);

  const dispose = useCallback(() => {
    disposeList.splice(0).map(e => e());
  }, []);

  const update = useCallback(() => {
    current.set(offsetMouse.value);
    delta.set(start).minus(current);
  }, []);

  const getEvent = useCallback(() => ({
    get start() { return start.clone(); },
    get current() { return current.clone(); },
    get delta() { return delta.clone(); }
  }), []);

  useEffect(() => dispose, []);

  return useCallback(
    (e: MouseEvent | ReactMouseEvent) => {
      if (typeof btn === 'number' && e.button !== btn)
        return;

      update();
      var moved = dragEnter(getEvent());
      var stop = moved?.(getEvent());

      disposeList.push(
        looper(() => {
          update();
          moved?.(getEvent());
        }),
        windowEvent('mouseup', () => {
          dispose();
        }),
        () => {
          stop?.(getEvent());
          moved = undefined;
          stop = undefined;
        },
      );
    }, []
  );
};