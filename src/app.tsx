import { DebugProvider } from "./components/Debug";
import { Node } from "./components/Node";
import { NodeBack, NodeHud, NodeList, NodeMap } from "./components/NodeEditor";
import { Scroll } from "./components/Scroll";
import {SizeControl} from "@/components/SizeControl";

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

          <NodeList>
            <Scroll />
            <SizeControl/>

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
        </NodeMap>
      </DebugProvider>
    </NodeHud>
  );
};