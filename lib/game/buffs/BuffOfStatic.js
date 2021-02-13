import {Buff} from "../core/buff";
import {Player} from "../core/player";

export class BuffOfStatic extends Buff {
  
  constructor() {
    super();
    this.name = "An eye for an  eye.";
    this.description = "Your attacker will be damaged for a percentage of what they deal to you.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 350, y: 50, width: 50, height: 50};
    this.damage = 20;
    this.damageEvent = this.onPlayerDamaged.bind(this);
  }

  onApply(reapply) {
    this.lifespan = 10.0; // Tens seconds of static
    if (reapply !== true) {
      this.player.events.on("damaged", this.damageEvent);
    }
  }

  onEnd() {
    this.player.events.off("damaged", this.damageEvent);
  }

  /**
   * @param {Player} damaged 
   * @param {number} amount 
   * @param {Player} damager 
   */
  onPlayerDamaged(damaged, amount, damager) {
    if (amount > 0) {
      damager.receiveDamage(amount * 0.4);
    }
  }

}