import { Vec2 } from "@/library/Vec2";
import { computed, useComputed } from "@preact/signals-react";

import { Debug } from "../Debug";
import { useNodeHud, useNodeList } from "../NodeEditor";
import s from "./Scroll.module.sass";

export const Scroll = () => {
  const hud = useNodeHud();
  const list = useNodeList();

  const sizes = useComputed(() => {
    const { value: rect } = list.rect;
    const viewRect = list.map.rect.value;
    const viewSize = Vec2.fromSize(viewRect);
    const biggerSize = Vec2.fromSize(rect).plus(rect)
      .minus(viewSize.cplus(viewRect)).cropMin(0);
    const lowerSize = new Vec2(viewRect).minus(rect).cropMin(0);
    const summ = viewSize.cplus(biggerSize).plus(lowerSize);

    viewSize.div(summ).times(100);
    lowerSize.div(summ).times(100);
    biggerSize.div(summ).times(100);

    return {
      viewSize,
      lowerSize,
      biggerSize,
    };
  });

  const horizontal = useComputed(() => {
    const size = sizes.value.viewSize.x;
    const right = sizes.value.biggerSize.x + '%';
    const left = sizes.value.lowerSize.x + '%';

    return (
      <div className={s.item} data-show={(size !== 100) || undefined} style={{ left, right }} />
    );
  });

  const vertical = useComputed(() => {
    const size = sizes.value.viewSize.y;
    const bottom = sizes.value.biggerSize.y + '%';
    const top = sizes.value.lowerSize.y + '%';

    return (
      <div className={s.item} data-show={(size !== 100) || undefined} style={{ bottom, top }} />
    );
  });

  return (
    <>
      <hud.Portal>
        {/* <div className={s.top}>{horizontal}</div> */}
        <div className={s.bottom}>{horizontal}</div>
        <div className={s.left}>{vertical}</div>
        {/* <div className={s.right}>{vertical}</div> */}
      </hud.Portal>

      <Debug title="Scroll">
        {{
          lowX: <>{computed(() => sizes.value.lowerSize.x.toFixed(2))}%</>,
          lowY: <>{computed(() => sizes.value.lowerSize.y.toFixed(2))}%</>,
          bigX: <>{computed(() => sizes.value.biggerSize.x.toFixed(2))}%</>,
          bigY: <>{computed(() => sizes.value.biggerSize.y.toFixed(2))}%</>,
        }}
      </Debug>
    </>
  );
};