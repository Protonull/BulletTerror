import {Buff} from "../core/buff";
import {EntityBullet} from "../core/bullet";
import {Player} from "../core/player";
import {Easing} from "../libs/easings";

export class BuffOfMissiles extends Buff {
  
  constructor() {
    super();
    this.name = "Definitely not Kai'Sa Q!";
    this.description = "Launches ten heat seeking missiles; enemy lock-on is random.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.NEVER;
    this.charges = 0;
    this.icon = {x: 100, y: 50, width: 50, height: 50};
    this.missilesToSpawn = 0;
    this.delayTillNext = 0.0;
  }
  
  onApply(reapply) {
    this.charges += 1; // One shot
    this.player.addAmmunition(this.fire.bind(this));
  }

  onUse() {
    return false;
  }

  fire() {
    this.missilesToSpawn = 60;
    this.charges--;
  }

  onUpdate() {
    this.delayTillNext -= ig.system.tick;
    if (this.delayTillNext <= 0) {
      if (this.missilesToSpawn-- > 0) {
        let missile = ig.game.spawnEntity(EntityGuidedMissile, this.player.firePositionX(), this.player.getPositionY(), this.player);
        missile.from = {x: this.player.getPositionX(), y: Math.randomFloat(missile.pos.y - 3, missile.pos.y + 3)};
        missile.target = ig.game.getEntitiesOfType(Player).erase(this.player).random();
        missile.pos.y = missile.from.y;
        this.delayTillNext += Math.randomFloat(0.3, 0.7);
        missile.duration = Math.randomFloat(1, 1.2);
        missile.remaining = Math.randomFloat(1, 1.2);
        // Tween the x position
        missile.missileXTween = [
          Easing.Quartic.EaseOut,
          Easing.Quartic.EaseIn,
          Easing.Circular.EaseInOut,
          Easing.Exponential.EaseInOut
        ].random();
        // Tween the y position
        missile.missileYTween = [
          Easing.Back.EaseIn,
          Easing.Back.EaseInOut
        ].random();
      }
      else {
        // Clamp to zero
        this.missilesToSpawn = 0;
      }
    }
    else {
      // Clamp to zero
      this.delayTillNext = 0;
    }
    //
    if (this.charges <= 0) {
      this.hide = true;
      if (this.missilesToSpawn <= 0) {
        this.removal = Buff.REMOVE.NOW;
      }
    }
  }

}

export class EntityGuidedMissile extends EntityBullet {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 5, y: 5};
    this.setPositionX(x + (this.size.x / 2) * player.lookDirection());
    this.setPositionY(y);
    this.damage = 0.5; // Damage on hit
    /** @type {Player} */
    this.target = null;
    this.ignoreBuffs = true;
    this.color = "#7a07c1";
  }

  update() {
    super.update();
    // Tick down time it takes to get to other player
    this.remaining -= ig.system.tick;
    var normalised = Math.normalise(this.remaining <= 0 ? 0 : this.remaining, this.duration, 0);
    this.pos.x = Math.lerp(this.missileXTween(normalised), this.from.x, this.target.getPositionX());
    this.pos.y = Math.lerp(this.missileYTween(normalised), this.from.y, this.target.getPositionY());
    if (this.remaining <= 0) {
      ig.game.removeEntity(this);
    }
  }

}