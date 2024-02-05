import { useNodeItem } from "@/components/NodeEditor";
import { useNodeSelection } from "@/components/NodeEditor/components/NodeSelection";

export const useSelect = () => {
  const item = useNodeItem();
  const { items } = useNodeSelection();
  return items.use().has(item);
};