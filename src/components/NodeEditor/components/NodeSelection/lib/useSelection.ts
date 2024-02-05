import {useNodeItem} from "@/components/NodeEditor";
import {useNodeSelection} from "@/components/NodeEditor/components/NodeSelection";
import {subscribe} from "@/utils/reactive.ts";
import {useSignal} from "@preact/signals-react";


export const useSelection = () => {
  const item = useNodeItem();
  const {items} = useNodeSelection();
  const isSelected = useSignal(items.has(item))
  subscribe(items, () => {
    isSelected.value = items.has(item)
  })
  return isSelected;
};