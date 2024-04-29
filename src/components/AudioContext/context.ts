export const context = new AudioContext();

let active = false;
onmousedown = onmouseup = onfocus = onblur = onkeydown = onkeyup = () => {
  if (active) return;
  context.resume()
    .then(() => {
      active = true;
      onmousedown = onmouseup = onfocus = onblur = onkeydown = onkeyup = null;
    });
};