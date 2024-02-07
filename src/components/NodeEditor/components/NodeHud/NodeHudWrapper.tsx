import { PropsWithChildren } from "react";
import { useNodeHud } from "@/components/NodeEditor";

export const NodeHudWrapper = ({ children }: PropsWithChildren) => {
  const hud = useNodeHud();
  return (
    <hud.Portal>{children}</hud.Portal>
  );
};