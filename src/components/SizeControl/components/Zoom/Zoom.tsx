import {useNodeMap} from "@/components/NodeEditor";
import s from "@/components/SizeControl/SizeControl.module.sass";

const DELTA_ZOOM = .12
export const Zoom = () => {
    const map = useNodeMap()

    const zoomIn = () => {
        map.toScale(DELTA_ZOOM)
    }
    const zoomOut = () => {
        map.toScale(-DELTA_ZOOM)
    }

    return (
        <>
            <div className={s.item} onClick={zoomIn}>+</div>
            <div className={s.item} onClick={zoomOut}>-</div>
        </>
    );
};