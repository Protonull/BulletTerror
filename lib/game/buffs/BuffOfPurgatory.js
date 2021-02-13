import {Buff} from "../core/buff";

export class BuffOfPurgatory extends Buff {
  
  constructor() {
    super();
    this.name = "Unwellness";
    this.description = "The target will not regenerate health for a short time.";
    this.targets = Buff.TARGET.OTHER;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 100, y: 0, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.lifespan = 4.0; // Two seconds of no regen
  }

  onUpdate() {
    this.player.isRegeneratingHealth = false;
  }

}