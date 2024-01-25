import { createRoot } from "react-dom/client";

import { App } from "@/app";

import { DebugProvider } from "./components/Debug";
import { NodeBack, NodeList, NodeMap } from "./components/NodeEditor";

createRoot(document.getElementById('root')!)
  .render((
    <DebugProvider>
      <NodeMap>
        <NodeBack
          type="circle"
          fill="#555"
          back={{ fill: "#333", stroke: '#555' }} />

        <NodeList>
          <App />
        </NodeList>
      </NodeMap>
    </DebugProvider>
  ));