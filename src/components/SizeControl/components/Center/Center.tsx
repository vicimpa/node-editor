import {useNodeList} from "@/components/NodeEditor";
import s from "../../SizeControl.module.sass";
import {Vec2} from "@/library/Vec2.ts";
import {min, minMax} from "@/utils/math.ts";
import {compute} from "@/utils/compute.ts";
import {useSignal, useSignalEffect} from "@preact/signals-react";
import {looper} from "@/utils/looper.ts";
import {rectCenter, rectIters} from "@/utils/domrect.ts";

const DELAY = 500
export const Center = () => {
  const list = useNodeList();
  const settingSize = useSignal(0);

  const centralize = () => {
    const mapSize = list.map.viewRect.value;
    const contentSize = Vec2.fromSize(list.rect.value);
    settingSize.value = min(...Vec2.fromSize(mapSize).cdiv(contentSize.cplus(50)))
    // const mapSize = list.map.viewRect.value;
    // const contentSize = Vec2.fromSize(list.rect.value);
    // rectCenter(list.rect.value).toSignals(list.map.x, list.map.y);
    // const scale = min(...Vec2.fromSize(mapSize).cdiv(contentSize.cplus(50)));
    // list.map.toScale(scale);
  };

  useSignalEffect(() => {
    if (!settingSize.value)
      return;

    const scaleTo = settingSize.peek()
    const scaleFrom = list.map.scale.peek()
    const mapRect = list.map.rect.peek();
    const contentRect = list.rect.peek()
    const zoomPercent = scaleTo / scaleFrom

    let startTime = 0
    return looper((time) => {
      if (!startTime) startTime = time
      else if (time - startTime > DELAY) settingSize.value = 0

      const progress = minMax((time - startTime) / DELAY, 0, 1)
      list.map.toScale(scaleFrom + scaleFrom * (zoomPercent - 1) * progress * progress)

      const stepTranslate = rectIters(mapRect, contentRect, progress)
      rectCenter(stepTranslate).toSignals(list.map.x, list.map.y);
    });
  });

  return compute(() => (
    <button
      className={s.item}
      onClick={centralize}
      disabled={!list.itemsCount.value}
    >
      <span className={"icon-radio-checked"}/>
    </button>
  ))
};
