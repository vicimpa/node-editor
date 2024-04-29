type TNumberKeys<T extends object> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T];

export class CustomAudioParam<T extends object> {
  constructor(
    public target: T,
    public key: TNumberKeys<T>,
    public minValue = 0,
    public maxValue = 0,
    public defaultValue: number = (target as any)[key],
  ) { }

  get value() {
    return (this.target as any)[this.key] as number;
  }

  set value(v) {
    (this.target as any)[this.key] = v;
  }
}