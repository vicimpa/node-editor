import { useNodeList, useNodeMap } from "@/components/NodeEditor";
import { compute } from "@/utils/compute.ts";

import s from "../../SizeControl.module.sass";

export const Center = () => {
  const list = useNodeList();
  const map = useNodeMap();

  const centralize = () => {
    map.focus(list.rect.value, 500);
  };

  return compute(() => (
    <button
      className={s.item}
      onClick={centralize}
      disabled={!list.itemsCount.value}
    >
      <span className={"icon-radio-checked"} />
    </button>
  ));
};
