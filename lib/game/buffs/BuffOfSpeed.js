import {Buff} from "../core/buff";

export class BuffOfSpeed extends Buff {
  
  constructor() {
    super();
    this.name = "My Kingdom for a horse!";
    this.description = "The player will move faster for a short period.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 250, y: 0, width: 50, height: 50};
    this.speedBoost = 100; // additional pixels per second
  }
  
  onApply(reapply) {
    this.lifespan = 7.0; // Seven seconds of speed
  }

  onUpdate() {
    if (this.player.isMovable) {
      this.player.speed += this.speedBoost;
    }
  }

}