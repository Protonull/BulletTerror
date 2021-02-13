import {Buff} from "../core/buff";

export class BuffOfHealing extends Buff {
  
  constructor() {
    super();
    this.name = "I Need Healing!";
    this.description = "Heals the target a significant amount over time.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 5.0; // Two seconds of no regen
    this.icon = {x: 150, y: 0, width: 50, height: 50};
    this.healing = 50; // hp per second
  }

  onUpdate() {
    if (this.player.isRegeneratingHealth) {
      this.player.healthRegeneration += this.healing;
    }
  }
  
}