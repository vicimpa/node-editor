import { counter } from "@/utils/counter";

const getId = counter();

export abstract class BasePort {
  id = `#${getId()}`;

  output = false;
  title = 'port';
  color = '#999';
  multy = false;

  abstract onConnect(port: BasePort): boolean;
  abstract onDisconnect(port: BasePort): boolean;
}