import { ViewMap } from "~/components/ViewMap";

import { Node } from "./components/Node";

export const App = () => {

  return (
    <ViewMap>
      <Node title="test">
        <h1>Hi</h1>
      </Node>
      <Node title="test">
        <h1>Hi</h1>
      </Node>
      <Node title="test">
        <h1>Hi</h1>
      </Node>
    </ViewMap>
  );
};