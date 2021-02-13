ig.require("impact.entity");

import {Entity} from "./entity";
import {Player} from "./player";
import {EntityBullet} from "./bullet";

/** @abstract */
export class Buff {
  
  constructor() {
    /** @type {string} */
    this.name = "Buff";
    /** @type {string} */
    this.description = "This buff does X, Y, and Z.";
    /** @type {Buff.TARGET} */
    this.targets = Buff.REMOVE.NONE;
    /** @type {Buff.REMOVE} */
    this.removal = Buff.REMOVE.NEVER;
    /** @type {number} The amount of charges if the buff has an active use. */
    this.charges = 0;
    /** @type {number} The lifespan of the buff, if it has one. Null means indefinite. */
    this.lifespan = 0;
    /** @type {{x: number, y: number, width: number, height: number}} */
    this.icon = {x: 0, y: 0, width: 0, height: 0};
    /** @type {Player} The player the buff is on. */
    this.player = null;
    /** @type {Player} Who gave the player this buff? */
    this.from = null;
    /** @type {boolean} Hide the buff? */
    this.hidden = false;
  }
  
  /**
   * This is called when a player grabs a buff from the stage.
   * @param {boolean} reapplied
   */
  onApply(reapplied) {}
  
  /** 
   * This is used when a player 'uses' a buff of them.
   * @returns {boolean}
   */
  onUse() {
    return true;
  }
  
  /** This is called every tick while a player has a buff. */
  onUpdate() {}
  
  /** 
   * This is called every tick while a player has a buff
   * @param {CanvasRenderingContext2D} context
   */
  onDraw(context) {}
  
  /** This is called when the buff is removed. */
  onEnd() {}
  
  /**
   * @param {Buff} buff
   * @returns {Buff}
   */
  static instantiateBuff(buff) {
    if (typeof buff === "function") {
      try {
        buff = new (buff)();
      }
      catch (error) {
        console.error("Could not instantiate that buff", error, buff);
        return null;
      }
    }
    if (buff instanceof Buff) {
      return buff;
    }
    return null;
  }
  
}

/**
 * @readonly
 * @enum {number} Determines where to find the target.
 */
Buff.TARGET = {
  NONE: 0,
  SELF: 1,
  OTHER: 2,
  RANDOM: 3,
  ALL: 4
};

/**
 * @readonly
 * @enum {number} Determines where to find the target.
 */
Buff.REMOVE = {
  NEVER: 0,
  NOW: 1,
  LIFESPAN: 2,
  CHARGES: 3,
  EITHER: 4,
  BOTH: 5
};

/**
 * The game entity that represents a buff on stage.
 */
export class EntityBuff extends Entity {
  
  /**
   * @param {number} x 
   * @param {number} y
   * @param {{buff: Buff, spawner: BuffSpawner}} properties
   */
  constructor(x, y, properties) {
    super(x, y, {
      name: "EntityBuff" + ++EntityBuff.buffCounter,
      type: ig.Entity.TYPE.NONE,
      checkAgainst: ig.Entity.TYPE.NONE,
      size: {x: EntityBuff.size, y: EntityBuff.size},
      vel: {x: 0, y: 0},
      maxVel: {x: 0, y: 0},
      zIndex: 8
    });
    // Buff stuff
    this.stage = EntityBuff.STAGE.SPAWNING;
    this.spawnTimer = EntityBuff.spawnTimer;
    this.stageTimer = 0;
    /** @type {Buff} */
    this.buff = properties.buff;
    /** @type {BuffSpawner} */
    this.spawner = properties.spawner;
    // Check collision with other buffs, spawning or onboard
    let buffs = ig.game.getEntitiesOfType(EntityBuff);
    for (let i = 10; i >= 0; i--) {
      for (let j = 0; j < buffs.length; j++){
        if (this.touches(buffs[j])) {
          if (i === 0) {
            ig.game.removeEntity(this);
            break;
          }
          this.setPositionX(this.spawner.getSpawnX());
          this.setPositionY(this.spawner.getSpawnY());
          break;
        }
      }
    }
  }
  
  /** @param {Entity} other */
  onCollisionEnter(other) {
    if (other instanceof EntityBullet) {
      // If bullet is tagged to ignore buffs, do nothing
      if (other.ignoreBuffs) {
        return;
      }
      /** @type {Player[]} A list of all /other/ players on stage */
      let others = ig.game.getEntitiesOfType(Player).erase(other.player);
      // Apply to target based on buff's preferences
      switch (this.buff.targets) {
        case Buff.TARGET.SELF:
          other.player.applyBuff(this.buff, other.player);
          break;
        case Buff.TARGET.OTHER:
          others[0].applyBuff(this.buff, other.player);
          break;
        case Buff.TARGET.RANDOM:
          others.random().applyBuff(this.buff, other.player);
          break;
        case Buff.TARGET.ALL:
          for (let i = 0; i < others.length; i++) {
            others[i].applyBuff(this.buff, other.player);
          }
          break;
      }
      // Remove buff from stage
      ig.game.removeEntity(this);
    }
  }
  
  /** @override */
  update() {
    super.update();
    switch (this.stage) {
      // If spawning, count down until on grabbable
      case EntityBuff.STAGE.SPAWNING: {
        this.spawnTimer -= ig.system.tick;
        if (this.spawnTimer <= 0) {
          this.spawnTimer = EntityBuff.spawnTimer;
          this.stageTimer = EntityBuff.boardLifespan;
          this.stage = EntityBuff.STAGE.ONSTAGE;
          this.type = ig.Entity.TYPE.BOTH;
          this.checkAgainst = ig.Entity.TYPE.BOTH;
        }
        break;
      }
      // If on stage, count down until timeout
      case EntityBuff.STAGE.ONSTAGE: {
        this.stageTimer -= ig.system.tick;
        if (this.stageTimer <= 0) {
          this.stageTimer = EntityBuff.boardLifespan;
          this.stage = EntityBuff.STAGE.DONE;
        }
        break;
      }
      case EntityBuff.STAGE.DONE: {
        ig.game.removeEntity(this);
      }
    }
  }
  
  /** @override */
  draw() {
    super.draw();
    /** @type {CanvasRenderingContext2D} */
    let context = ig.system.context;
    /** @type {HTMLCanvasElement} */
    let icon = ig.game.spriteMain.getArea(this.buff.icon.x, this.buff.icon.y, this.buff.icon.width, this.buff.icon.height);
    let position = {x: this.getPositionX(), y: this.getPositionY()};
    // Start rendering
    switch (this.stage) {
      case EntityBuff.STAGE.SPAWNING: {
        var spawnSize = EntityBuff.size * Math.clamp(1 - Math.normalise(this.spawnTimer, 0, EntityBuff.spawnTimer), 0.9, 1);
        context.save();
        context.globalAlpha = Math.clamp(1 - Math.normalise(this.spawnTimer, 0, EntityBuff.spawnTimer), 0.4, 0.7);
        context.translate(position.x, position.y);
        context.rotate(-(Math.PI / 2));
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, (spawnSize / 2), 0, Math.PI * (2 * (1 - Math.clamp(Math.normalise(this.spawnTimer, 0, EntityBuff.spawnTimer), 0, 1))));
        context.lineTo(0, 0);
        context.clip();
        context.closePath();
        context.rotate(Math.PI / 2);
        context.drawImage(icon, 0, 0, 50, 50, -(spawnSize / 2), -(spawnSize / 2), spawnSize, spawnSize);
        context.restore();
        break;
      }
      case EntityBuff.STAGE.ONSTAGE: {
        context.save();
        context.globalAlpha = 0.9;
        context.translate(position.x, position.y);
        context.rotate(-(Math.PI / 2));
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, (EntityBuff.size / 2), 0, Math.PI * 2);
        context.lineTo(0, 0);
        context.clip();
        context.closePath();
        context.rotate(Math.PI / 2);
        context.drawImage(icon, 0, 0, 50, 50, -(EntityBuff.size / 2), -(EntityBuff.size / 2), EntityBuff.size, EntityBuff.size);
        context.restore();
      }
    }
  }
  
}

// Meta
EntityBuff.buffCounter = 0;

// Engine
EntityBuff.spawnX = 0; // Will be set by main.js
EntityBuff.spawnMinimumY = 0; // Will be set by main.js
EntityBuff.spawnMaximumY = 0; // Will be set by main.js
EntityBuff.size = 35.0;
EntityBuff.spawnScale = 0.8;
EntityBuff.spawnTimer = 3.0;
EntityBuff.boardLifeSpan = 10.0;
EntityBuff.spawnStagger = 3.0;
EntityBuff.firstSpawnStagger = 1.0;

/**
 * @readonly
 * @enum {number} States the buff's current spawning state
 */
EntityBuff.STAGE = {
  UNSPAWNED: 0,
  SPAWNING: 1,
  ONSTAGE: 2,
  DONE: 3
};

export class BuffSpawner {
  /** @param {Function[]} buffs A list of buffs to register automatically */
  constructor(...buffs) {
    /** @type {Function[]} */
    this.cache = buffs ? buffs : [];
    /** @type {EntityBuff[]} */
    this.stage = [];
    /** @type {number} */
    this.spawnTimer = EntityBuff.spawnStagger - EntityBuff.firstSpawnStagger;
  }
  update() {
    this.spawnTimer += ig.system.tick;
    if (this.spawnTimer >= EntityBuff.spawnStagger) {
      this.spawnTimer -= EntityBuff.spawnStagger;
      if (this.cache.length > 0) {
        ig.game.spawnEntity(EntityBuff, this.getSpawnX(), this.getSpawnY(), {
          buff: new (this.cache[Math.randomInt(0, this.cache.length - 1)])(),
          spawner: this
        });
      }
    }
  }
  
  /** @returns {number} Returns an X coordinate. */
  getSpawnX() {
    return 0;
  }
  
  /** @returns {number} Returns a Y coordinate. */
  getSpawnY() {
    return 0;
  }
  
  /** @param {Function} buffClass A buff class that extends from Buff. */
  registerBuff(buffClass) {
    this.cache.push(buffClass);
  }
  
}