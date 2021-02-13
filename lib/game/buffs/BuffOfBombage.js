import {Buff} from "../core/buff";
import {Entity} from "../core/entity";
import {EntityBullet} from "../core/bullet";
import {Player} from "../core/player";

export class BuffOfBombage extends Buff {
  
  constructor() {
    super();
    this.name = "Grenade Launcher";
    this.description = "Fires a grenade!";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.CHARGES;
    this.charges = 0;
    this.icon = {x: 50, y: 0, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.charges += 1; // One shot
    this.player.addAmmunition(this.fire.bind(this));
  }

  onUse() {
    return false;
  }

  fire() {
    ig.game.spawnEntity(EntityBombBullet, this.player.firePositionX(), this.player.getPositionY(), this.player);
    this.charges--;
  }
  
}

export class EntityBombBullet extends EntityBullet {

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 40, y: 25};
    this.setPositionX(x + (this.size.x / 2) * player.lookDirection());
    this.setPositionY(y);
    this.damage = 0;
  }
  
  /**
   * @override
   * @param {Entity} other
   */
  onCollisionEnter(other) {
    if (!(other instanceof Player)) {
      return;
    }
    if (other === this.player) {
      return;
    }
    ig.game.spawnEntity(EntityBombExplosion, this.getPositionX(), this.getPositionY(), this.player);
    ig.game.removeEntity(this);
  }

}

export class EntityBombExplosion extends EntityBullet {
  
  /**
   * @param {number} x
   * @param {number} y
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 50, y: 50};
    this.setPositionX(x);
    this.setPositionY(y);
    this.ignoreBuffs = true;
    this.drawBullet = false;
    this.vel = {x: 0, y: 0};
    this.zIndex = 10;
    this.animSheet = new ig.AnimationSheet(null, 100, 100);
    this.animSheet.image = ig.game.spriteExplosion.image;
    this.addAnim("explode", 0.03, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,72,73,74], true);
    this.currentAnim = this.anims["explode"];
    this.damage = 60;
  }
  
  /** @override */
  update() {
    super.update();
    if (this.currentAnim.loopCount > 0) {
      ig.game.removeEntity(this);
    }
  }
  
  /**
   * @override
   * @param {Entity} other
   */
  onCollisionEnter(other) {
    if (!(other instanceof Player)) {
      return;
    }
    if (other === this.player) {
      return;
    }
    other.receiveDamage(this.damage, this.player);
  }

}