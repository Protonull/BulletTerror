import {Buff} from "../core/buff";

export class BuffOfProtection extends Buff {
  
  constructor() {
    super();
    this.name = "The best offence is a good defence.";
    this.description = "Makes the player immune to damage.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 200, y: 0, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.lifespan = 2.0; // Two seconds protection
  }

  onUpdate() {
    // Ensure the player cannot be damaged
    this.player.isDamageable = false;
  }

}