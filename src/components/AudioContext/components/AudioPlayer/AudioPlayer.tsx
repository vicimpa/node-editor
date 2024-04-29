import { FC, useMemo } from "react";

import { useCalc } from "@/hooks/useCalc";
import { compute } from "@/utils/compute";
import { MaybeSignal, unsignal } from "@/utils/unsignal";
import { useComputed, useSignalEffect } from "@preact/signals-react";

import s from "./AudioPlayer.module.sass";
import { Marquee } from "./components/Marquee";
import { Progress } from "./components/Progress";

export type AudioPlayerProps = {
  audio?: HTMLAudioElement;
  file?: MaybeSignal<File | null>;
};

export const AudioPlayer: FC<AudioPlayerProps> = (props) => {
  const audio = useMemo(() => (
    props.audio ?? new Audio()
  ), [props.audio]);

  const file = useComputed(() => {
    return unsignal(props.file) ?? null;
  });

  const fileName = useComputed(() => {
    const name = file.value?.name;
    return name ? `🎵${name}` : 'No select file';
  });

  const played = useCalc(() => !audio.paused);

  useSignalEffect(() => {
    if (file.value)
      audio.src = URL.createObjectURL(file.value);
  });

  return (
    <div className={s.player}>
      <Marquee>{fileName}</Marquee>
      <div className={s.buttons}>
        {compute(() => (
          <>
            <button
              disabled={!file.value}
              onClick={() => {
                if (!audio.paused)
                  audio.pause();
                else
                  audio.play();
              }}
            >
              <i className={s[played.value ? 'pb-pause' : 'pb-play']} />
            </button>
            <button
              disabled={!file.value}
              onClick={() => {
                if (!audio.paused)
                  audio.pause();
                audio.currentTime = 0;
              }}
            >
              <i className={s['pb-stop']} />
            </button>
          </>
        ))}
        <Progress audio={audio} file={file} />
      </div>
    </div>
  );
};