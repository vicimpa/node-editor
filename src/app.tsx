import { Node } from "./components/Node";
import { NodeList, NodeMap, NodeMapBack } from "./components/NodeEditor";
import { NodeLayers } from "./components/NodeEditor/NodeLayers";

export const App = () => {

  return (
    <NodeMap>
      <NodeMapBack
        type="circle"
        fill="#555"
        back={{ fill: '#333', stroke: '#444' }} />
      <NodeLayers>
        <NodeList>
          <Node
            id="#0"
            title="TestNode"
            input={[
              { id: '0', name: 'test' }
            ]}
          >
          </Node>
          <Node
            id="#2"
            title="TestNode"
            output={[
              { id: '0', name: 'test' }
            ]}
          >
          </Node>
        </NodeList>
      </NodeLayers>
    </NodeMap>
  );
};