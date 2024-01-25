import { DebugProvider } from "./components/Debug";
import { Node } from "./components/Node";
import { NodeBack, NodeList, NodeMap } from "./components/NodeEditor";

export const App = () => {
  return (
    <DebugProvider>
      <NodeMap>
        <NodeBack
          type="circle"
          fill="#555"
          back={{ fill: "#333", stroke: '#555' }} />

        <NodeList>
          <Node>

          </Node>
        </NodeList>
      </NodeMap>
    </DebugProvider>
  );
};