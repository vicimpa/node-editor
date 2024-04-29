import { FC } from "react";

import { compute } from "@/utils/compute";
import { fixed } from "@/utils/fixed";
import { useSignal, useSignalEffect } from "@preact/signals-react";

import s from "./Range.module.sass";

export type RangeProps = {
  param: AudioParam;
  label?: string;
  postfix?: string;
  minValue?: number;
  maxValue?: number;
  accuracy?: number;
  onChange?: () => void;
};

export const Range: FC<RangeProps> = (props) => {
  const value = useSignal(props.param.defaultValue);
  const accuracy = props.accuracy ?? 0;
  const step = 1 / (10 ** accuracy);

  useSignalEffect(() => {
    props.param.value = value.value;
  });

  return (
    <div className={s.range}>
      <div className={s.label}>
        <span>{props.label ?? 'Label'}</span>
        <span data-grow />
        <span>{fixed(value, accuracy)}</span>
        <span>{props.postfix}</span>
      </div>
      {compute(() => (
        <input
          type="range"
          value={value.value}
          onChange={({ currentTarget }) => {
            value.value = +currentTarget.value;
            props.onChange?.();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            value.value = props.param.defaultValue;
            props.onChange?.();
          }}
          step={step}
          style={{ width: '200px' }}
          min={props.minValue ?? props.param.minValue}
          max={props.maxValue ?? props.param.maxValue} />
      ))}
    </div>
  );
};