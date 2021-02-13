import {Buff} from "../core/buff";

export class BuffOfNetting extends Buff {
  
  constructor() {
    super();
    this.name = "Netting";
    this.description = "Prevents the target from moving.";
    this.targets = Buff.TARGET.OTHER;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 0, y: 50, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.lifespan = 1.0; // Two seconds of being rooted
  }

  onUpdate() {
    this.player.isMovable = false;
  }

}