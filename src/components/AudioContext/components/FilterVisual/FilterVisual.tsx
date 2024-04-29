import { forwardRef, useEffect, useMemo } from "react";

import { useResizer } from "@/hooks/useResizer";
import { useSignalRef } from "@/hooks/useSignalRef";
import { useSignal, useSignalEffect } from "@preact/signals-react";

import { avgArray } from "../../library/avgArray";
import { frequencies } from "../../library/frequencies";
import s from "./FilterVisual.module.sass";

export type FilterVisualProps = {
  node: BiquadFilterNode;
};

function freqName(n: number) {
  if (n >= 1000) return ((n / 1000) | 0) + "k";
  return n + '';
}

export type FilterVisualRender = {
  render(): void;
};


export const FilterVisual = forwardRef<FilterVisualRender, FilterVisualProps>(({ node }, render) => {
  const ref = useSignalRef<HTMLDivElement>(null);
  const atts = useSignal(0);
  const { can, ctx } = useMemo(() => {
    const can = document.createElement('canvas');
    const ctx = can.getContext('2d')!;
    return { can, ctx };
  }, []);

  const freq = new Float32Array(avgArray(frequencies, 4));
  const out = new Float32Array(freq.length);
  const outPhase = new Float32Array(freq.length);
  const size = useResizer(ref);
  const getX = (x: number, length: number) => (
    (x + 0.5) * (can.width / length)
  );

  useEffect(() => {
    if (!render)
      return;

    Object.assign(render, {
      current: {
        render() {
          atts.value++;
        }
      }
    });

    return () => {
      Object.assign(render, {
        current: null
      });
    };
  }, []);

  useSignalEffect(() => {
    if (!ref.current) return;
    ref.current.appendChild(can);
    atts.value;

    can.width = size.width;
    can.height = size.height;

    ctx.clearRect(0, 0, can.width, can.height);
    node.getFrequencyResponse(freq, out, outPhase);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '7px Arial';

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    for (let i = 0; i < frequencies.length; i++) {
      ctx.strokeText(freqName(frequencies[i]), getX(i, frequencies.length), 2);
    }

    ctx.lineWidth = .5;
    ctx.strokeStyle = '#999';
    ctx.beginPath();

    for (let i = 0; i < frequencies.length; i++) {
      const x = getX(i, frequencies.length);
      ctx.moveTo(x, 10);
      ctx.lineTo(x, can.height - 10);
    }

    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1d0a8e';
    ctx.beginPath();

    for (let i = 0; i < freq.length; i++) {
      const x = getX(i, freq.length);
      ctx[i === 0 ? 'moveTo' : 'lineTo'](x, can.height + -out[i] * can.height * .5);
    }

    ctx.stroke();
    ctx.closePath();

    return () => {
      can.remove();
    };
  });

  return (
    <div className={s.visual} ref={ref} />
  );
});