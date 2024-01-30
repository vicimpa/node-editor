import s from "@/components/SizeControl/SizeControl.module.sass";
import {MutableRefObject, useRef} from "react";

export const FullScreen = () => {
    const ref = useRef() as MutableRefObject<HTMLDivElement>
    const toggleFullscreen = async () => {
        if (typeof document.fullscreenEnabled !== undefined) {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                const el = document.documentElement;
                if (el.requestFullscreen) {
                    await el.requestFullscreen();
                } else if (el.mozRequestFullScreen) {
                    await el.mozRequestFullScreen();
                } else if (el.webkitRequestFullscreen) {
                    await el.webkitRequestFullscreen();
                } else if (el.msRequestFullscreen) {
                    await el.msRequestFullscreen();
                }
            }
        }
    };

    return (
        <div className={`${s.item} ${s.text}`} ref={ref} onClick={toggleFullscreen}>FULL</div>
    );
};