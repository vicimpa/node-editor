import "./styles/style.css";

import { DebugProvider } from "./components/Debug";
import { MainLayout } from "./components/Layout";
import { Node } from "./components/Node";
import {
    NodeBack, NodeHud, NodeLayers, NodeList, NodeMap, NodePort
} from "./components/NodeEditor";
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
              <NodeList>
                <Scroll />
                <SizeControl />

                <Node title="My test node" color="#333">
                  <h1>Test node</h1>
                  <NodePort title="123" color="#f00" />
                  <NodePort title="123123" />
                  <NodePort title="123" output />
                </Node>

              </NodeList>
            </NodeLayers>
          </NodeMap>
        </DebugProvider>
      </NodeHud>
    </MainLayout>
  );
};