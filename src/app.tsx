import { Node } from "./components/Node";
import { NodeList, NodeMap, NodeMapBack } from "./components/NodeEditor";

export const App = () => {
  return (
    <>
      <NodeMap>
        <NodeMapBack
          type="circle"
          fill="#555"
          back={{ fill: '#333', stroke: '#444' }} />
        <NodeList>
          <Node
            title="Operator"
            input={[
              { name: 'preview ' },
              { name: 'var a', color: '#0f0' },
              { name: 'var b ', color: '#0f0' },
            ]}
            output={[
              { name: 'true ' },
              { name: 'false' },
            ]}
          >
            <label>
              Type
              <select>
                <option label="number" />
                <option label="string" />
                <option label="boolean" />
                <option label="null" />
                <option label="undefined" />
                <option label="bigint" />
              </select>
            </label>
            <label>
              Operator
              <select>
                <option label="===" />
                <option label="==" />
                <option label=">" />
                <option label=">=" />
                <option label="<" />
                <option label="<=" />
              </select>
            </label>
            <label>
              Params
              <select>
                <option label="auto" />
                <option label="a manual" />
                <option label="b manual" />
              </select>
            </label>
          </Node>
          <Node title="Operator" output={[
            { name: '123 ' },
            { name: '123123' },
          ]}>
            Test bla bla
          </Node>
        </NodeList>
      </NodeMap>
    </>
  );
};