import { FC, useRef } from "react";
import { Signal } from "tone";

import { compute } from "@/utils/compute";
import { useSignal, useSignalEffect } from "@preact/signals-react";

import { CustomAudioParam } from "../../library/CustomAudioParam";
import s from "./Range.module.sass";

export type RangeProps = {
  param: AudioParam | CustomAudioParam<any> | Signal<any>;
  label?: string;
  postfix?: string;
  minValue?: number;
  maxValue?: number;
  accuracy?: number;
  onChange?: () => void;
  batch?: number;
};

export const Range: FC<RangeProps> = (props) => {
  const defaultValue = 'defaultValue' in props.param
    ? props.param.defaultValue
    : props.param.value;

  const value = useSignal(defaultValue);
  const accuracy = props.accuracy ?? 0;
  const step = 1 / (10 ** accuracy);
  const ref = useRef<HTMLSpanElement>(null);
  const batch = useRef(setTimeout(() => { }));

  useSignalEffect(() => {
    if (typeof props.batch === 'number') {
      clearTimeout(batch.current);
      Object.assign(batch, {
        current: setTimeout(() => {

          props.param.value = value.value;
        }, props.batch)
      });
    } else {
      props.param.value = value.value;
    }


    if (ref.current) {
      ref.current.innerText = value.value.toFixed(accuracy);
    }
  });

  const inEdit = (span: HTMLSpanElement) => {
    span.setAttribute('contenteditable', '');
    span.focus();
  };

  const offEdit = (span: HTMLSpanElement) => {
    span.removeAttribute('contenteditable');
    const val = +span.innerText;
    if (!isNaN(val)) {
      value.value = val;
      props.onChange?.();
    }
  };

  return (
    <div className={s.range}>
      <div className={s.label}>
        <span>{props.label ?? 'Label'}</span>
        <span data-grow />
        <span
          ref={ref}
          onKeyDown={e => {
            if (e.code !== 'Enter')
              return;
            e.preventDefault();
            e.stopPropagation();

            offEdit(e.currentTarget);
          }}
          onBlur={e => {
            offEdit(e.currentTarget);
          }}
          onMouseDown={e => {
            inEdit(e.currentTarget);
          }}
        />
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
            value.value = defaultValue;
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