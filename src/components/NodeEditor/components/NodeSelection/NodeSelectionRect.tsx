import {forward} from "@/utils/forward.ts";
import {Vec2} from "@/library/Vec2.ts";
import {Signal} from "@preact/signals-react";
import {FC} from "react";
import {useNodeLayers} from "@/components/NodeEditor";
import {compute} from "@/utils/compute.ts";

type NodeSelectionProps = {
  from: Signal<Vec2>;
  to: Signal<Vec2>;
}
export const NodeSelectionRect: FC<NodeSelectionProps> = forward<'rect', NodeSelectionProps>(
  ({from, to}, ref) => {
    const {Portal} = useNodeLayers();

    return (
      <Portal>
        {
          compute(() => {
            const f = from.value
            const t = to.value

            const start = f.clone().cropMax(t)
            const end = f.clone().cropMin(t)
            const delta = end.cminus(start).abs()

            return <>
              <rect
                x={start.x}
                y={start.y}
                width={delta.x}
                height={delta.y}
                rx={5}
                ry={5}
                ref={ref}
                stroke={"hsla(0, 0%, 100%, .5)"}
                fill={"hsla(0, 0%, 50%, .5)"}
                strokeWidth={1}
              />
            </>
          })
        }
      </Portal>
    )
  }
)