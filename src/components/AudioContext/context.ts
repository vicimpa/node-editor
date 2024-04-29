import { getContext } from "tone";

export const context = getContext();

let active = false;
onmousedown = onmouseup = onfocus = onblur = onkeydown = onkeyup = () => {
  if (active) return;
  context.resume()
    .then(() => {
      active = true;
      onmousedown = onmouseup = onfocus = onblur = onkeydown = onkeyup = null;
    });
};