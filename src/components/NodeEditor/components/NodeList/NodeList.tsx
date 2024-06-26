import { Component, ReactNode } from "react";

import { Debug } from "@/components/Debug";
import { useConnect } from "@/hooks/useConnect";
import { useSubEmit } from "@/hooks/useSubEmit";
import { compute } from "@/utils/compute";
import { fixed } from "@/utils/fixed";

import { NodeItem, NodeItemCtx } from "../NodeItem";
import { NodeMapCtx, useNodeMap } from "../NodeMap";
import { NodeListCtx, NodeListProvider } from "./";

export type NodeListProps = {
  children?: ReactNode;
};

export class NodeList extends Component<NodeListProps> {
  map!: NodeMapCtx;
  ctx = new NodeListCtx(this);

  render(): ReactNode {
    const { ctx, props } = this;
    const { children } = props;

    return (
      <NodeListProvider value={ctx}>
        {
          compute(() => (
            this.map = useNodeMap(),
            useConnect(ctx),
            <>
              {children}

              <g ref={ctx.ref}>
                {
                  compute(() => {
                    useSubEmit(ctx.list);
                    var last: NodeItemCtx | undefined;

                    return (
                      <>
                        {
                          ctx.list
                            .map((ctx, key) => (
                              last = ctx,
                              <NodeItem key={key} ctx={ctx} />
                            ))
                        }

                        <Debug title="Active Item">
                          {
                            last ?
                              ({
                                Id: last.id,
                                PosX: <>{fixed(last.x)}</>,
                                PosY: <>{fixed(last.y)}</>,
                                Width: <>{fixed(last.width)}</>,
                                Height: <>{fixed(last.height)}</>,
                              }) :
                              ({
                                Id: 'None',
                                PosX: 'None',
                                PosY: 'None',
                                Width: 'None',
                                Height: 'None',
                              })
                          }
                        </Debug>
                      </>
                    );
                  })
                }
              </g>
            </>
          ))
        }
      </NodeListProvider>
    );
  }
};