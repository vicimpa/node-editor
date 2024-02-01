import s from "../../../SizeControl.module.sass";

type ZoomButtonProps = {
  handler: (e: React.MouseEvent) => void
  isZoomIn: boolean
  disabled: boolean
}
export const ZoomButton = ({handler, disabled, isZoomIn}: ZoomButtonProps) => (
  <button
    className={s.item}
    onMouseDown={handler}
    disabled={disabled}
  ><span className={isZoomIn ? "icon-zoom-in" : "icon-zoom-out"}/>
  </button>
)