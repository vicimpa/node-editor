import { useNodeList } from "@/components/NodeEditor";
import s from "@/components/SizeControl/SizeControl.module.sass";
import { Vec2 } from "@/library/Vec2.ts";
import { rectCenter } from "@/utils/domrect.ts";
import { min } from "@/utils/math.ts";

type CenterProps = {

};
export const Center = ({ }: CenterProps) => {
  const list = useNodeList();

  const centralize = () => {
    const mapSize = list.map.viewRect.value;
    const contentSize = Vec2.fromSize(list.rect.value);
    rectCenter(list.rect.value).toSignals(list.map.x, list.map.y);
    const scale = min(...Vec2.fromSize(mapSize).cdiv(contentSize.cplus(50)));
    list.map.toScale(scale);
  };
  return (
    <div className={`${s.item} ${s.text}`} onClick={centralize}>CNTR</div>
  );
};