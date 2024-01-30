import s from "../../SizeControl.module.sass";

export const FullScreen = () => {
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
    <div className={s.item} onClick={toggleFullscreen}><span className={"icon-enlarge"}/></div>
  );
};