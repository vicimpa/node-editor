import { useMemo } from "react";

import { useClass } from "@/hooks/useClass";
import { useSubEmit } from "@/hooks/useSubEmit";
import { ReactiveSet } from "@/library/ReactiveSet";
import { compute } from "@/utils/compute";

import { Node } from "../Node";
import { useNodeHud, useNodeMap } from "../NodeEditor";
import { AudioContextPort } from "./AudioContextPort";
import { ContextMenu, TContextMenuItem } from "./components/ContextMenu";
import { DeleteButton } from "./components/DeleteButton";
import { BaseNode } from "./library/BaseNode";
import { NodeCollection, TNodeCollectionList } from "./NodeCollection";

export const AudioContext = () => {
  const nodes = useClass(ReactiveSet<BaseNode>);
  const HUD = useNodeHud().useItem();
  const map = useNodeMap();

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
            const node: BaseNode = new (item as any)();
            node.start.set(map.x.value, map.y.value);
            nodes.add(node);
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
        <ContextMenu menu={[...menu, { name: 'Open GitHub', onClick() { window.open('https://github.com/vicimpa/node-editor'); } }]} />
      </HUD.Portal>
      {
        compute(() => (
          useSubEmit(nodes),
          [...nodes].map(node => (
            <Node
              id={node.id}
              key={node.id}
              x={node.start.x}
              y={node.start.y}
              color={node.color}
              title={`${node.id} ${node.title}`}
            >
              <DeleteButton onClick={() => nodes.delete(node)} />

              <node.Render />

              {node.ports.map((port) => (
                <AudioContextPort key={port.id} port={port} />
              ))}
            </Node>
          ))
        ))}
    </>
  );
};