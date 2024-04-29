import { MiniMap } from "@/components/MiniMap";
import { NodeSelection } from "@/components/NodeEditor/components/NodeSelection";

import { AudioContext } from "./components/AudioContext";
import { DebugProvider } from "./components/Debug";
import { NodeBack, NodeHud, NodeLayers, NodeList, NodeMap } from "./components/NodeEditor";
import { NodeLines } from "./components/NodeEditor/components/NodeLines";
import { Scroll } from "./components/Scroll";
import { SizeControl } from "./components/SizeControl";

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
            <NodeLines>
              <NodeList>
                <NodeSelection>
                  <Scroll />
                  <SizeControl />
                  <MiniMap />
                  <AudioContext />
                </NodeSelection>
              </NodeList>
            </NodeLines>
          </NodeLayers>
        </NodeMap>
      </DebugProvider>
    </NodeHud>
  );
};