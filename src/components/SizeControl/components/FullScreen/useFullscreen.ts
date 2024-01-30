import {useSignal} from "@preact/signals-react";
import {documentEvent} from "@/utils/events.ts";

export const useFullscreen = () => {
  const isFullscreen = useSignal(0)
  documentEvent('fullscreenchange', () => {
    document.fullscreenElement ?
      isFullscreen.value = 1
      :
      isFullscreen.value = 0
  })

  return isFullscreen
};