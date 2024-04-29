import { FC } from "react";

import { compute } from "@/utils/compute";
import { fixed } from "@/utils/fixed";
import { useSignal, useSignalEffect } from "@preact/signals-react";

import { AudioContextPort } from "../../AudioContextPort";
import { MixItem } from "../../node/control/Mixer";
import s from "./MixerLine.module.sass";

export const MixerLine: FC<{ item: MixItem; }> = ({ item }) => {
  const gain = useSignal(1);
  const pan = useSignal(0);
  const mute = useSignal(false);

  useSignalEffect(() => {
    item.output.gain.value = gain.value;
    item.pan.pan.value = pan.value;
    item.mute.gain.value = mute.value ? 0 : 1;
  });

  return (
    <>
      <div className={s.line}>
        <div className={s.block}>
          {
            compute(() => (
              <input
                type="range"
                min={-1}
                max={1}
                value={pan.value}
                disabled={mute.value}
                step={.001}
                onChange={e => {
                  const val = +e.currentTarget.value;
                  if (!isNaN(val)) pan.value = val;
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  pan.value = 0;
                }}
                data-small />
            ))
          }
        </div>
        <div className={s.block}>
          {
            compute(() => (
              <input
                type="range"
                min={0}
                max={1.4}
                value={gain.value}
                disabled={mute.value}
                step={.001}
                onChange={e => {
                  const val = +e.currentTarget.value;
                  if (!isNaN(val)) gain.value = val;
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  gain.value = 1;
                }}
                data-vertical />
            ))
          }
          <span>
            {fixed(gain, 2)}
          </span>
        </div>
        <div className={s.block}>
          <button onClick={() => mute.value = !mute.value}>
            {
              compute(() => mute.value ? 'Unmute' : 'Mute')
            }
          </button>
        </div>
      </div>
      {item.ports.map((port) => (
        <AudioContextPort key={port.id} port={port} />
      ))}
    </>
  );
};