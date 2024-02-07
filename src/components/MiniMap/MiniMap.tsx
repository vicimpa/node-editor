import { useNodeList } from "@/components/NodeEditor";
import s from "./MiniMap.module.sass";
import { Component, createElement } from "react";
import { Vec2 } from "@/library/Vec2.ts";
import { effect } from "@preact/signals-react";
import { useShortcut } from "@/hooks/useShortcut.ts";
import { useValistore } from "@/hooks/useValistore.ts";
import { schema } from "@/components/Debug";
import { NodeHudWrapper } from "@/components/NodeEditor/components/NodeHud/NodeHudWrapper.tsx";
import { MiniMapCtx, MiniMapProvider } from "@/components/MiniMap/MiniMapCtx.ts";
import { useConnect } from "@/hooks/useConnect.ts";
import { compute } from "@/utils/compute.ts";

export const MiniMap = () => (
  <NodeHudWrapper>
    <MiniMapClass />
  </NodeHudWrapper>
);

class MiniMapClass extends Component {
  ctx = new MiniMapCtx();

  render() {
    const { ctx } = this;
    return (
      <MiniMapProvider value={ctx}>
        {
          createElement(
            () => (
              ctx.list = useNodeList(),
                useConnect(ctx),
                compute(() => <MiniMapComponent ctx={ctx} />)
            )
          )
        }
      </MiniMapProvider>
    );
  }
}

type MiniMapComponent = {
  ctx: MiniMapCtx
}
const MiniMapComponent = ({ ctx }: MiniMapComponent) => {
  const { list, canvas, height, width } = ctx;
  const { map } = list;
  const showMap = useValistore('SHOW_MAP', schema, false);

  effect(() => {
    if (!canvas || !canvas.current) return;
    const miniCtx = canvas.current.getContext('2d');
    if (!miniCtx) return;
    const mapWidth = map.xLimit;
    const mapHeight = map.yLimit;
    const scale = width / mapWidth;
    const mapSizeCorrect = new Vec2(mapWidth, mapHeight).div(2);
    miniCtx.clearRect(0, 0, width, height);
    list.list.forEach(node => {
      miniCtx.fillStyle = node.color.value;
      miniCtx.fillRect(
        mapSizeCorrect.cplus(Vec2.fromPoint(node.rect.value)).times(scale),
        Vec2.fromSize(node.rect.value).times(scale)
      );
    });

    miniCtx.strokeStyle = "hsl(0, 50%, 60%)";
    miniCtx.strokeRect(
      mapSizeCorrect.cplus(Vec2.fromPoint(map.rect.value)).times(scale),
      Vec2.fromSize(map.viewRect.value).times(scale).div(map.scale.value)
    );
  });

  useShortcut('m', () => {
    showMap.value = !showMap.value;
  });

  return (
    <canvas width={width} height={height} className={s.map} ref={canvas} data-show={showMap.value || undefined} />
  );
};