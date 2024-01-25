import { useCallback } from "react";

import { makeDrag, TDragStart } from "@/utils/makeDrag";

import { useEvent } from "./useEvent";

export const useDrag = (
  _dragStart: TDragStart,
  btn = 0
) => {
  const dragStart = useEvent(_dragStart);
  return useCallback(makeDrag(dragStart, btn), []);
};