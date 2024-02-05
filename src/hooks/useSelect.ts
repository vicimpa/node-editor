import {useNodeSelection} from "@/components/NodeEditor/components/NodeSelection";
import {useNodeItem} from "@/components/NodeEditor";

export const useSelect = () => {
  const item = useNodeItem();
  const {items} = useNodeSelection()
  return items.use().has(item.id)
}