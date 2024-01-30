import { SizeControl } from "@/components/SizeControl";

import { DebugProvider } from "./components/Debug";
import { Node } from "./components/Node";
import { NodeBack, NodeHud, NodeLayers, NodeList, NodeMap } from "./components/NodeEditor";
import { Scroll } from "./components/Scroll";

export const App = () => {
  return (
    <NodeHud>
      <DebugProvider>
        <NodeMap>
          <NodeBack
            type="circle"
            fill="#555"
            r={4}
            back={{ fill: "#333", stroke: '#555' }} />

          <NodeLayers>
            <NodeList>
              <Scroll />

              <Node>
                <h1>Hi 123123</h1>
                <h1>Hi 123123</h1>
                <h1>Hi 123123</h1>
                <h1>Hi 123123</h1>
                <h1>Hi 123123</h1>
              </Node>

              <Node>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
                <h1>Hi 123123 123 123123 123123</h1>
              </Node>

              <Node>
                <textarea />
              </Node>
            </NodeList>
          </NodeLayers>
        </NodeMap>
      </DebugProvider>
    </NodeHud>
  );
};