import { FC } from "react";

import { compute } from "@/utils/compute";
import { fixed } from "@/utils/fixed";
import { Signal } from "@preact/signals-react";

export type RangeProps = {
  value: Signal<number>;
  min?: number;
  max?: number;
  step?: number;
};

export const Range: FC<RangeProps> = (props) => {
  return (
    <p>
      {fixed(props.value, 2)}
      {' '}
      {compute(() => (
        <input
          type="range"
          step={props.step}
          value={props.value.value}
          onChange={({ currentTarget }) => {
            props.value.value = +currentTarget.value;
          }}
          style={{ width: '200px' }}
          min={props.min}
          max={props.max} />
      ))}
    </p>
  );
};