import {Buff} from "../core/buff";
import {EntityBullet} from "../core/bullet";

export class BuffOfCover extends Buff {
  
  constructor() {
    super();
    this.name = "Cover me";
    this.description = "Summons a wall for a short time that will block all projectiles.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.CHARGES;
    this.charges = 0;
    this.icon = {x: 200, y: 50, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.charges += 1; // One wall
  }

  onUse() {
    ig.game.spawnEntity(EntityWall, this.player.firePositionX(), this.player.getPositionY(), this.player);
    return true;
  }

  onUpdate() {
    this.player.isWeaponEnabled = false;
  }
  
}

export class EntityWall extends EntityBullet {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 20, y: 80};
    let offset = 100;
    this.setPositionX(x + ((this.size.x / 2) + offset) * player.lookDirection());
    this.setPositionY(y);
    this.vel = this.maxVel = {x: 0, y: 0};
    this.lifespan = 4.0; // Four seconds of wallage
    this.color = "#b2b2b2";
  }

  update() {
    super.update();
    this.lifespan -= ig.system.tick;
    if (this.lifespan < 0) {
      ig.game.removeEntity(this);
    }
  }

  /** 
   * @param {Entity} other 
   * @override
   */
  onCollisionEnter(other) {
    if (other instanceof EntityBullet) {
      ig.game.removeEntity(other);
    }
  }

}