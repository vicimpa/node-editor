import { Vec2 } from "@/library/Vec2.ts";

export class Path2DString {
  map = new Map<string, number[]>();

  moveTo(args: Vec2) {
    this.map.set("M", args.tuple);
    return this;
  }

  lineTo(args: Vec2) {
    this.map.set("L", args.tuple);
    return this;
  }

  lineToHorizontal(x: number) {
    const start = this.map.get("M");
    if (!start) return this;
    const y0 = start[1];
    this.map.set("H", [x, y0]);
    return this;
  }

  lineToVertical(y: number) {
    const start = this.map.get("M");
    if (!start) return this;
    const x0 = start[0];
    this.map.set("V", [x0, y]);
    return this;
  }

  cubicBezierCurve(...args: Vec2[]) {
    this.map.set("C", args.map(arr => arr.tuple).flat());
    return this;
  }

  cubicSmoothBezierCurve(...args: Vec2[]) {
    this.map.set("S", args.map(arg => arg.tuple).flat());
    return this;
  }

  quadraticBezierCurve(...args: Vec2[]) {
    this.map.set("Q", args.map(arg => arg.tuple).flat());
    return this;
  }

  quadraticSmoothBezierCurve(...args: Vec2[]) {
    this.map.set("T", args.map(arg => arg.tuple).flat());
    return this;
  }

  ellipticalArcCurve(...args: [radius: Vec2, angel: number, largeArcFlag: 1 | 0, sweepFlag: 1 | 0, Vec2]) {
    this.map.set("A", args.map(arg => typeof arg === "number" ? arg : arg.tuple).flat());
    return this;
  }

  closePath() {
    this.map.set("Z", []);
    return this;
  }

  toString() {
    const params: string[] = [];
    this.map.forEach((item, key) => {
      params.push(`${key}${item.join(" ")}`);
    });
    return params.join(" ");
  }
}