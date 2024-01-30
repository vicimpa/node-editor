import { MutableRefObject, useRef } from "react";

import s from "@/components/SizeControl/SizeControl.module.sass";

export const FullScreen = () => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  const toggleFullscreen = async () => {
    if (typeof document.fullscreenEnabled !== undefined) {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const el = document.documentElement;
        await el.requestFullscreen();
      }
    }
  };

  return (
    <div className={`${s.item} ${s.text}`} ref={ref} onClick={toggleFullscreen}>FULL</div>
  );
};