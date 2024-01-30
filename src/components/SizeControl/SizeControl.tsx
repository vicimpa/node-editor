import { useNodeHud } from "@/components/NodeEditor";
import { Center } from "@/components/SizeControl/components/Center";
import { FullScreen } from "@/components/SizeControl/components/FullScreen";
import { Zoom } from "@/components/SizeControl/components/Zoom";

import s from "./SizeControl.module.sass";

export const SizeControl = () => {
  const hud = useNodeHud();

  return (
    <hud.Portal>
      <div className={s.control}>
        <Zoom />
        <FullScreen />
        <Center />
      </div>
    </hud.Portal>
  );
};