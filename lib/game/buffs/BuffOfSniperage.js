import {Buff} from "../core/buff";
import {EntityBullet} from "../core/bullet";

export class BuffOfSniperage extends Buff {
  
  constructor() {
    super();
    this.name = "Sniperage";
    this.description = "Fires a powerful, high speed shot.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.CHARGES;
    this.charges = 0;
    this.icon = {x: 150, y: 50, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.charges += 1; // One shot
    this.player.addAmmunition(this.fire.bind(this));
  }

  onUse() {
    return false;
  }

  fire() {
    ig.game.spawnEntity(EntitySniperBullet, this.player.firePositionX(), this.player.getPositionY(), this.player);
    this.charges--;
  }
  
}

export class EntitySniperBullet extends EntityBullet {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 40, y: 10};
    this.setPositionX(x + (this.size.x / 2) * player.lookDirection());
    this.setPositionY(y);
    this.vel.x *= 3;
    this.damage = 70; // Damage on hit
  }

}