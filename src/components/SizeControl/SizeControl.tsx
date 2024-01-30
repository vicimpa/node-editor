import s from "./SizeControl.module.sass"
import {useNodeHud, useNodeList} from "@/components/NodeEditor";
import {FullScreen} from "@/components/SizeControl/components/FullScreen";
import {Zoom} from "@/components/SizeControl/components/Zoom";
import {Vec2} from "@/library/Vec2.ts";
import {max} from "@/utils/math.ts";

export const SizeControl = () => {
    const hud = useNodeHud();
    const list = useNodeList()

    const centralize = () => {
        //const mapSize = list.map.viewRect.value
        const contentSize = Vec2.fromSize(list.rect.value)
        const scale = max(...contentSize.div(Vec2.fromSize(list.rect.value).plus(50)))
        console.log(scale)
        list.map.toScale(scale)
    }

    return (
        <hud.Portal>
            <div className={s.control}>
                <Zoom/>
                <FullScreen />
                <div className={`${s.item} ${s.text}`} onClick={centralize}>CNTR</div>
            </div>
        </hud.Portal>
    );
};