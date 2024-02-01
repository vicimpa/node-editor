import "./styles/style.css";

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
                  <Scroll />
                  <SizeControl />

                  <Node title="My test node" color="#00f">
                    <h1>Test node</h1>
                    <NodePort title="123" color="#f00" />
                    <NodePort title="123123" />
                    <NodePort title="123" output />
                  </Node>


                  <Node x={-200} y={100} title="My test node" color="#0f0">
                    <h1>Test node</h1>
                    <NodePort title="123" color="#f00" />
                    <NodePort title="123123" />
                    <NodePort title="123" output />
                  </Node>


                  <Node x={100} y={200} title="My test node" color="#f0f">
                    <h1>Test node</h1>
                    <NodePort title="123" color="#f00" />
                    <NodePort title="123123" />
                    <NodePort title="123" output />
                  </Node>
                </NodeList>
              </NodeLines>
            </NodeLayers>
          </NodeMap>
        </DebugProvider>
      </NodeHud>
    </MainLayout>
  );
};