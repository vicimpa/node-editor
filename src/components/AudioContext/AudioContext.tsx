import { useMemo } from "react";

import { useClass } from "@/hooks/useClass";
import { useSubEmit } from "@/hooks/useSubEmit";
import { ReactiveSet } from "@/library/ReactiveSet";
import { compute } from "@/utils/compute";

import { Node } from "../Node";
import { NodePort, useNodeHud } from "../NodeEditor";
import { ContextMenu, TContextMenuItem } from "./components/ContextMenu";
import { DeleteButton } from "./components/DeleteButton";
import { BaseNode } from "./library/BaseNode";
import { NodeCollection, TNodeCollectionList } from "./NodeCollection";

export const AudioContext = () => {
  const nodes = useClass(ReactiveSet<BaseNode>);
  const HUD = useNodeHud().useItem();

  const menu = useMemo(() => {
    const toMenu = (col: TNodeCollectionList): TContextMenuItem[] => {

      return col.map((item) => ({
        name: item.name,
        ...(typeof item === 'function' ? {
          onClick() {
            for (const f of nodes) {
              if (f.single && f instanceof item)
                return;
            }

            nodes.add(new (item as any)());
          }
        } : {
          children: toMenu(item.children)
        })
      }));
    };

    return toMenu(NodeCollection);
  }, [NodeCollection]);

  return (
    <>
      <HUD.Portal>
        <ContextMenu head="Append node" menu={menu} />
      </HUD.Portal>
      {
        compute(() => (
          useSubEmit(nodes),
          [...nodes].map(node => (
            <Node
              id={node.id}
              key={node.id}
              color={node.color}
              title={`${node.id} ${node.title}`}
            >
              <DeleteButton onClick={() => nodes.delete(node)} />

              <node.Render />

              {node.ports.map((port) => (
                <NodePort
                  id={port.id}
                  key={port.id}
                  output={port.output}
                  title={port.title}
                  color={port.color}
                  meta={port}
                  onConnect={e => {
                    return port.onConnect(e.meta);
                  }}
                  onDisconnect={e => {
                    return port.onDisconnect(e.meta);
                  }} />
              ))}
            </Node>
          ))
        ))}
    </>
  );
};