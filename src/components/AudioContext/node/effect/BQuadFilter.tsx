import { createRef, ReactNode } from "react";

import { FilterVisual, FilterVisualRender } from "../../components/FilterVisual/FilterVisual";
import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

const types = [
  "allpass",
  "bandpass",
  "highpass",
  "highshelf",
  "lowpass",
  "lowshelf",
  "notch",
  "peaking"
];

export class BQuadFilter extends BaseNode {
  static showName = 'BQuadFilter';
  color = '#195e40';
  ref = createRef<FilterVisualRender>();
  node = context.createBiquadFilter();

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node)
  ];

  render(): ReactNode {
    return (
      <>
        <FilterVisual ref={this.ref} node={this.node} />
        <select
          defaultValue={this.node.type}
          onChange={(e) => {
            this.node.type = e.currentTarget.value as any;
            this.ref.current?.render();
          }}
        >
          {types.map((type) => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>

        <Range
          param={this.node.frequency}
          label="Frequency"
          postfix="HZ"
          onChange={() => this.ref.current?.render()}
        />

        <Range
          param={this.node.Q}
          label="Q"
          minValue={-100}
          maxValue={100}
          accuracy={1}
          onChange={() => this.ref.current?.render()}
        />

        <Range
          param={this.node.detune}
          label="Detune"
          postfix="cents"
          minValue={-1200}
          maxValue={1200}
          onChange={() => this.ref.current?.render()}
        />

        <Range
          param={this.node.gain}
          label="Gain"
          minValue={-10}
          maxValue={10}
          accuracy={2}
          onChange={() => {
            this.ref.current?.render();
          }}
        />
      </>
    );
  }
}