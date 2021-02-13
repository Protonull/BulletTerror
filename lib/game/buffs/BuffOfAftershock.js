import {Buff} from "../core/buff";
import {Player} from "../core/player";

export class BuffOfAftershock extends Buff {
  
  constructor() {
    super();
    this.name = "Mirror Hit";
    this.description = "Every time you deal damage, you will automatically fire another bullet for free.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 300, y: 50, width: 50, height: 50};
    this.damage = 20;
    this.dealtEvent = this.onDamageDealt.bind(this);
  }

  onApply(reapply) {
    this.lifespan = 5.0; // Tens seconds of static
    if (!reapply) {
      this.player.events.on("dealt", this.dealtEvent);
    }
  }

  onEnd() {
    this.player.events.off("dealt", this.dealtEvent);
  }

  /**
   * @param {Player} damager
   * @param {number} amount 
   * @param {Player} damaged
   */
  onDamageDealt(damager, amount, damaged) {
    if (amount > 5) {
      damager.fire();
    }
  }

}