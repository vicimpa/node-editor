import {useNodeList} from "@/components/NodeEditor";
import s from "../../SizeControl.module.sass";
import {Vec2} from "@/library/Vec2.ts";
import {rectCenter} from "@/utils/domrect.ts";
import {min} from "@/utils/math.ts";

export const Center = () => {
  const list = useNodeList();

  const centralize = () => {
    if (list.list.size) {
      const mapSize = list.map.viewRect.value;
      const contentSize = Vec2.fromSize(list.rect.value);
      rectCenter(list.rect.value).toSignals(list.map.x, list.map.y);
      const scale = min(...Vec2.fromSize(mapSize).cdiv(contentSize.cplus(50)));
      list.map.toScale(scale);
    }
  };

  return (
    <button className={s.item} onClick={centralize} disabled={!list.itemsCount.value}><span
      className={"icon-radio-checked"}/>
    </button>
  );
};