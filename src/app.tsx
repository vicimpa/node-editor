import { MiniMap } from "@/components/MiniMap";
import { NodeSelection } from "@/components/NodeEditor/components/NodeSelection";

import { DebugProvider } from "./components/Debug";
import { MainLayout } from "./components/Layout";
import { Node } from "./components/Node";
import {
    NodeBack, NodeHud, NodeLayers, NodeList, NodeMap, NodePort
} from "./components/NodeEditor";
import { NodeLines } from "./components/NodeEditor/components/NodeLines";
import { Scroll } from "./components/Scroll";
import { SizeControl } from "./components/SizeControl";

export const App = () => {
  return (
    <MainLayout>
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

                    <Node color={"#17f"}>
                      <h1>Test node</h1>
                      <NodePort />
                      <NodePort />
                      <NodePort output />
                    </Node>

                    <Node color={"#f71"}>
                      <h1>Test node</h1>
                      <NodePort />
                      <NodePort />
                      <NodePort output />
                    </Node>

                    <Node>
                      <h1>Test node</h1>
                      <NodePort />
                      <NodePort />
                      <NodePort output />
                    </Node>


                  </NodeSelection>
                </NodeList>
              </NodeLines>
            </NodeLayers>
          </NodeMap>
        </DebugProvider>
      </NodeHud>
    </MainLayout>
  );
};