import {useNodeHud} from "@/components/NodeEditor";

import s from "../../SizeControl.module.sass";
import {useComputed} from "@preact/signals-react";
import {useFullscreen} from "@/components/SizeControl/components/FullScreen/useFullscreen.ts";

export const FullScreen = () => {
  const isFullscreen = useFullscreen()
  const hud = useNodeHud();
  const toggleFullscreen = async () => {
    if (typeof document.fullscreenEnabled !== undefined) {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await hud.ref.current?.requestFullscreen();
      }
    }
  };

  const icon = useComputed(() => {
    return isFullscreen.value ? <span className={"icon-shrink"}/> : <span className={"icon-enlarge"}/>
  })

  return (
    <div className={s.item} onClick={toggleFullscreen}>{icon}</div>
  );
};