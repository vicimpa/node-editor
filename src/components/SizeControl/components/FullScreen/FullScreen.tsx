import { useNodeHud } from "@/components/NodeEditor";

import s from "../../SizeControl.module.sass";

export const FullScreen = () => {
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

  return (
    <div className={s.item} onClick={toggleFullscreen}><span className={"icon-enlarge"} /></div>
  );
};