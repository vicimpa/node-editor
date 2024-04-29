import { BasePort } from "../library/BasePort";

export class AudioPort extends BasePort {
  title = 'audio';
  color = '#4444aa';
  multy = true;

  constructor(
    public type: 'in' | 'out',
    public node: AudioNode
  ) {
    super();

    if (type === 'out')
      this.output = true;
  }

  onConnect(port: BasePort): boolean {
    if (this.type === 'in')
      return true;

    if (!(port instanceof AudioPort))
      return false;

    try {
      this.node.connect(port.node);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  onDisconnect(port: BasePort): boolean {
    if (this.type === 'in')
      return true;

    if (!(port instanceof AudioPort))
      return false;

    try {
      this.node.disconnect(port.node);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}