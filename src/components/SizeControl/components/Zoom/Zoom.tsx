import {useNodeMap} from "@/components/NodeEditor";
import s from "../../SizeControl.module.sass";
import {useWindowEvent} from "@/hooks/useWindowEvent";
import {looper} from "@/utils/looper";
import {useSignal, useSignalEffect} from "@preact/signals-react";

const DELTA_ZOOM = .12;

export const Zoom = () => {
  const map = useNodeMap();
  const delta = useSignal(0);

  useWindowEvent(['mouseup', 'blur'], () => {
    delta.value = 0;
  });

  useSignalEffect(() => {
    if (!delta.value)
      return;

    return looper((_, dtime) => {
      map.toScale((v) => (
        v + delta.peek() * dtime * DELTA_ZOOM * .01
      ));
    });
  });

  return (
    <>
      <div className={s.item} onMouseDown={() => delta.value += 1}>+</div>
      <div className={s.item} onMouseDown={() => delta.value -= 1}>-</div>
    </>
  );
};