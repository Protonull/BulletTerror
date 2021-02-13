import {Buff} from "../core/buff";

export class BuffOfSlowness extends Buff {
  
  constructor() {
    super();
    this.name = "Cold Feet.";
    this.description = "The target will move slower for a short time.";
    this.targets = Buff.TARGET.OTHER;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 450, y: 0, width: 50, height: 50};
    this.speedLoss = 150; // fewer pixels per second
  }
  
  onApply(reapply) {
    this.lifespan = 2.0; // Two seconds of slowness
  }

  onUpdate() {
    if (this.player.isMovable) {
      this.player.speed -= this.speedLoss;
    }
  }

}