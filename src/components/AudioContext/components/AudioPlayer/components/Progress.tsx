import { FC } from "react";

import { useCalc } from "@/hooks/useCalc";
import { useDrag } from "@/hooks/useDrag";
import { compute } from "@/utils/compute";
import { MaybeSignal, unsignal } from "@/utils/unsignal";

import s from "../AudioPlayer.module.sass";

export type ProgressProps = {
  audio: HTMLAudioElement;
  file: MaybeSignal<File | null>;
};

export const Progress: FC<ProgressProps> = ({ audio, file }) => {
  const time = useCalc(() => audio.currentTime);
  const total = useCalc(() => isNaN(audio.duration) ? 0 : audio.duration);
  const progress = useCalc(() => {
    return unsignal(file) ? total.value ? time.value / total.value : 0 : undefined;
  });

  const drag = useDrag(({ target }) => {
    if (!(target instanceof HTMLProgressElement))
      return;

    return (e) => {
      const { x: X, width } = target.getBoundingClientRect();
      const offsetX = e.current.x - X;
      audio.currentTime = offsetX / width * audio.duration;
    };
  });

  return (
    compute(() => (
      <progress
        value={progress.value}
        className={s.progress}
        onMouseDown={drag} />
    ))
  );
};