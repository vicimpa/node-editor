export const checkRectInRect = (rect: DOMRect, zone: DOMRect) => {
  const {x: xRect, y: yRect, height: hRect, width: wRect} = rect
  const {x: xZone, y: yZone, height: hZone, width: wZone} = zone
  return (
    xRect >= xZone &&
    yRect >= yZone &&
    xRect + hRect <= xZone + wZone &&
    yRect + wRect <= yZone + hZone
  )
}