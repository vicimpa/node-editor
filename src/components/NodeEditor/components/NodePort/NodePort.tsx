import { Component } from "react";

import { NodePortCtx } from "./NodePortCtx";

export type NodePortProps = {
  output?: boolean;
};

export class NodePort extends Component {
  ctx = new NodePortCtx();

}