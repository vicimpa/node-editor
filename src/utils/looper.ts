export type TLoop = (time: number, deltaTime: number) => any;

var LOOPS = new Set<TLoop>();

var time = -1;
var deltaTime = -1;

var loop = (newTime: number) => {
  requestAnimationFrame(loop);

  if (time < 0)
    return time = newTime;

  deltaTime = newTime - time;
  time = newTime;

  LOOPS.forEach(runLoop);
};

requestAnimationFrame(loop);

export const runLoop = <T extends TLoop>(loop: T): ReturnType<T> => {
  return loop(time, deltaTime);
};

export const looper = <T extends TLoop>(loop: T) => (
  LOOPS.add(loop),
  () => { LOOPS.delete(loop); }
);