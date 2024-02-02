import {useNodeMap} from "@/components/NodeEditor";
import {useWindowEvent} from "@/hooks/useWindowEvent";
import {compute} from "@/utils/compute.ts";
import {looper} from "@/utils/looper";
import {useComputed, useSignal, useSignalEffect} from "@preact/signals-react";

import {ZoomButton} from "./components/ZoomButton.tsx";
import {MouseEvent} from "react";

export const Zoom = () => {
  const map = useNodeMap();
  const delta = useSignal(0);

  const zoomDisabled =
    useComputed(() => ({
      zoomInDisabled: map.scale.value === map.scaleMax,
      zoomOutDisabled: map.scale.value === map.scaleMin
    }));

  const handlerMouseDown = (isZoomIn: boolean) => {
    return (e: MouseEvent) => {
      if (e.button !== 0) return;
      const deltaValue = isZoomIn ? 1 : -1;
      delta.value += deltaValue;
    };
  };

  useWindowEvent(['mouseup', 'blur'], () => {
    delta.value = 0;
  });

  useSignalEffect(() => {
    if (zoomDisabled.value.zoomInDisabled || zoomDisabled.value.zoomOutDisabled)
      delta.value = 0;
  });

  useSignalEffect(() => {
    if (!delta.value)
      return;

    return looper((_, dtime) => {
      map.toScale((v) => (
        v + delta.peek() * dtime * v * .002
      ));
    });
  });

  return (
    <>
      {compute(() =>
        <ZoomButton
          isZoomIn={true}
          disabled={zoomDisabled.value.zoomInDisabled}
          handler={handlerMouseDown(true)}/>)
      }
      {compute(() =>
        <ZoomButton
          isZoomIn={false}
          disabled={zoomDisabled.value.zoomOutDisabled}
          handler={handlerMouseDown(false)}/>)
      }
    </>
  );
};

