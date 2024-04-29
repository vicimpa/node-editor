import { createElement, useMemo } from "react";

import { useClass } from "@/hooks/useClass";
import { useSubEmit } from "@/hooks/useSubEmit";
import { ReactiveSet } from "@/library/ReactiveSet";

import { Node } from "../Node";
import { NodePort } from "../NodeEditor";
import { AudioPlayerNode } from "./node/AudioPlayerNode";
import { BaseNode } from "./node/BaseNode";
import { DelayAudioNode } from "./node/DelayAudioNode";
import { DestinationNode } from "./node/DestinationNode";
import { GainAudioNode } from "./node/GainAudioNode";

export const AudioContext = () => {
  const base = useMemo(() => [
    new DestinationNode(),
    new AudioPlayerNode(),
    new GainAudioNode(),
    new DelayAudioNode(),
  ], []);
  const nodes = useClass(ReactiveSet<BaseNode>);

  const NodeRender = (node: BaseNode) => (
    <Node
      key={node.id}
      color={node.color}
      title={`${node.id} ${node.title}`}>
      {createElement(node.render.bind(node))}
      {node.ports.map((port) => (
        <NodePort
          output={port.output}
          title={port.title}
          color={port.color}

          meta={port}
          onConnect={e => {
            return port.onConnect(e.meta);
          }}
          onDisconnect={e => {
            return port.onDisconnect(e.meta);
          }} />
      ))}
    </Node>
  );

  return (
    <>
      {
        base.map(NodeRender)
      }
      {
        createElement(() => (
          useSubEmit(nodes),
          [...nodes].map(NodeRender)
        ))}
    </>
  );
};