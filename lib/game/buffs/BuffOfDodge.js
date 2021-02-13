import {Buff} from "../core/buff";
import {Player} from "../core/player";

export class BuffOfDodge extends Buff {
  
  constructor() {
    super();
    this.name = "Dodge!";
    this.description = "Teleports the player to the opposite side of their area.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.CHARGES;
    this.charges = 0;
    this.icon = {x: 50, y: 50, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.charges += 1; // One usage
  }

  onUse() {
    if (this.player.isMovable) {
      let normPositionY = 1 - Math.normalise(this.player.getPositionY(), Player.positionMinimumY, Player.positionMaximumY);
      this.player.setPositionY(Math.lerp(normPositionY, Player.positionMinimumY, Player.positionMaximumY));
      return true;
    }
    return false;
  }

  onUpdate() {
    this.player.isWeaponEnabled = false;
  }

}