import {Buff} from "../core/buff";
import {Entity} from "../core/entity";
import {Player} from "../core/player";
import {EntityBombExplosion} from "./BuffOfBombage";

export class BuffOfHell extends Buff {
  
  constructor() {
    super();
    this.name = "Summon a meteor from hell!";
    this.description = "Fires a grenade!";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.CHARGES;
    this.charges = 0;
    this.icon = {x: 300, y: 0, width: 50, height: 50};
  }
  
  onApply(reapply) {
    this.charges += 1; // One shot
    this.player.addAmmunition(this.fire.bind(this));
  }
  
  onUse() {
    return false;
  }
  
  fire() {
    /** @type {Player[]} A list of all /other/ players on stage */
    let others = ig.game.getEntitiesOfType(Player).erase(this.player);
    for (let i = 0; i < others.length; i++) {
      ig.game.spawnEntity(EntityCrosshair, others[i].getPositionX(), others[i].getPositionY(), this.player);
    }
    this.charges--;
  }
  
}

export class EntityCrosshair extends Entity {
  
  /**
   * @param {number} x
   * @param {number} y
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, {
      size: {x: 50, y: 50}
    });
    this.rotation = 0;
    this.icon = {x: 450, y: 50, width: 50, height: 50};
    this.player = player;
    this.coundown = 2.0; // Two seconds until meteor hits!
  }
  
  update() {
    super.update();
    this.coundown -= ig.system.tick;
    if (this.coundown <= 0) {
      ig.game.spawnEntity(EntityMeteor, this.getPositionX(), this.getPositionY(), this.player);
      ig.game.removeEntity(this);
    }
  }
  
  draw() {
    super.draw();
    /** @type {CanvasRenderingContext2D} */
    let context = ig.system.context;
    /** @type {HTMLCanvasElement} */
    let icon = ig.game.spriteMain.getArea(this.icon.x, this.icon.y, this.icon.width, this.icon.height);
    context.save();
    context.translate(this.getPositionX(), this.getPositionY());
    context.rotate(this.rotation += 0.07);
    context.drawImage(icon, 0, 0, 50, 50, -(this.size.x / 2), -(this.size.y / 2), this.size.x, this.size.y);
    context.restore();
  }
  
}

export class EntityMeteor extends EntityBombExplosion {
  
  /**
   * @param {number} x
   * @param {number} y
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, player);
    // Redo setPosition() based on new size
    this.size = {x: 100, y: 100};
    this.setPositionX(x);
    this.setPositionY(y);
    this.damage = 90;
  }
  
}