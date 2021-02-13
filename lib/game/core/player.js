import {Game} from "../main";
import {Entity} from "./entity";
import * as EE from "../libs/eventemitter3";
import {EntityBullet} from "./bullet";
import {Buff} from "./buff";
import {BuffOfDeath} from "../buffs/BuffOfDeath";
import {BuffOfExhaustion} from "../buffs/BuffOfExhaustion";

export class Player extends Entity {

  /**
   * @param {number} x 
   * @param {number} y
   * @param {number} up
   * @param {number} down
   * @param {number} using
   */
  constructor(x, y, up, down, using) {
    super(x, y, {
      size: {x: Player.width, y: Player.height},
      vel: {x: 0, y: 0},
      maxVel: {x: 0, y: Player.maxVelY},
      zIndex: 9
    });
    this.angle = {x: 0, y: 0};
    this.keyStates = {up: false, down: false, using: false};
    // Bind inputs
    ig.input.bind(up, "PLAYER_" + this.id + "_UP");
    ig.input.bind(down, "PLAYER_" + this.id + "_DOWN");
    ig.input.bind(using, "PLAYER_" + this.id + "_FIRING");
    // Meta
    this.score = 0;
    this.colour = "#FFF";
    // Stats
    this.health = Player.baseHealth;
    this.energy = Player.baseEnergy;
    this.speed = Player.baseMovementSpeed;
    this.healthRegeneration = Player.baseHealthRegeneration;
    this.energyRegeneration = Player.baseEnergyRegeneration;
    this.exhausted = false;
    this.dead = false;
    // Tags
    this.isMovable = Player.defaultMovability;
    this.isActive = Player.defaultActivity;
    this.isTargetable = Player.defaultTargetability;
    this.isDamageable = Player.defaultDamageability;
    this.isRegeneratingHealth = Player.defaultRegenerateHealth;
    this.isRegeneratingEnergy = Player.defaultRegenerateEnergy;
    this.hasMovementCost = Player.defaultHaveMovementCosts;
    this.hasActivityCost = Player.defaultHaveActivityCosts;
    this.isWeaponEnabled = Player.defaultWeaponStatus;
    this.isBuffable = Player.defaultBuffability;
    /** @type {Function[]} */
    this.ammunition = [];
    /** @type {Buff[]} */
    this.buffs = [];
    this.applyBuff(BuffOfExhaustion, this);
    // Events
    this.events = new EE.EventEmitter();
    // Scored kill event
    this.events.on("killed", (function () {
      this.score++;
    }).bind(this));
  }
  
  /** @override */
  ready() {
    this.events.emit("spawned", this);
  }

  /** @override */
  update() {
    // Update inputs
    this.keyStates.up = ig.input.state("PLAYER_" + this.id + "_UP") || false;
    this.keyStates.down = ig.input.state("PLAYER_" + this.id + "_DOWN") || false;
    this.keyStates.using = ig.input.pressed("PLAYER_" + this.id + "_FIRING") || false;
    // Reset impact properties
    this.maxVel.y = Player.maxVelY;
    // Reset (some) stats
    this.speed = Player.baseMovementSpeed;
    this.vel.y = 0;
    this.healthRegeneration = Player.baseHealthRegeneration;
    this.energyRegeneration = Player.baseEnergyRegeneration;
    // Reset tags
    this.isMovable = Player.defaultMovability;
    this.isActive = Player.defaultActivity;
    this.isTargetable = Player.defaultTargetability;
    this.isDamageable = Player.defaultDamageability;
    this.isRegeneratingHealth = Player.defaultRegenerateHealth;
    this.isRegeneratingEnergy = Player.defaultRegenerateEnergy;
    this.hasMovementCost = Player.defaultHaveMovementCosts;
    this.hasActivityCost = Player.defaultHaveActivityCosts;
    this.isWeaponEnabled = Player.defaultWeaponStatus;
    this.isBuffable = Player.defaultBuffability;
    // Process buffs
    for (let i = 0; i < this.buffs.length; i++) {
      let buff = this.buffs[i];
      // Process lifespan
      buff.lifespan -= ig.system.tick;
      if (buff.lifespan <= 0) {
        buff.lifespan = 0;
        switch (buff.removal) {
          case Buff.REMOVE.EITHER:
          case Buff.REMOVE.LIFESPAN:
            buff.onEnd();
            this.buffs.splice(i, 1);
            continue;
        }
      }
      // Process charges
      if (buff.charges > 0) {
        if (this.isActive && this.keyStates.using) {
          if (buff.onUse()) {
            buff.charges--;
          }
        }
      }
      else {
        buff.charges = 0;
        switch (buff.removal) {
          case Buff.REMOVE.EITHER:
          case Buff.REMOVE.CHARGES:
            buff.onEnd();
            this.buffs.splice(i, 1);
            continue;
        }
      }
      // Check if both have expired
      if (buff.lifespan <= 0 && buff.charges <= 0) {
        switch (buff.removal) {
          case Buff.REMOVE.EITHER:
          case Buff.REMOVE.BOTH:
            buff.onEnd();
            this.buffs.splice(i, 1);
            continue;
        }
      }
      // Check if remove now
      if (buff.removal === Buff.REMOVE.NOW) {
        buff.onEnd();
        this.buffs.splice(i, 1);
        continue;
      }
      // If buff still exists, update it
      buff.onUpdate();
    }
    // Process movement
    if (this.speed < 0) {
      this.speed = 0;
    }
    if (!this.dead) {
      let movementCost = Player.movementCost * ig.system.tick;
      if (this.hasMovementCost && this.energy < movementCost) {
        this.isMovable = false;
      }
      if (this.isMovable) {
        if (this.keyStates.up && !this.keyStates.down) {
          this.vel.y = -this.speed;
          if (this.hasMovementCost) {
            this.energy -= movementCost;
          }
          this.events.emit("movement", this);
        }
        else if (!this.keyStates.up && this.keyStates.down) {
          this.vel.y = this.speed;
          if (this.hasMovementCost) {
            this.energy -= movementCost;
          }
          this.events.emit("movement", this);
        }
      }
    }
    // Process regeneration
    if (this.isRegeneratingHealth && this.healthRegeneration > 0) {
      this.health += this.healthRegeneration * ig.system.tick;
      this.events.emit("health_regenerated", this);
    }
    if (this.isRegeneratingEnergy && this.energyRegeneration > 0) {
      this.energy += this.energyRegeneration * ig.system.tick;
      this.events.emit("energy_regenerated", this);
    }
    // Update weapon
    if (this.isWeaponEnabled && this.isActive && this.keyStates.using) {
      if (!this.hasActivityCost || this.energy >= Player.activityCost) {
        if (this.ammunition.length > 0) {
          this.ammunition.shift()();
        }
        else {
          this.fire();
        }
        if (this.hasActivityCost) {
          this.energy -= Player.activityCost;
        }
      }
    }
    // Process the base entity
    super.update();
    // Clamp player health and energy
    this.health = Math.clamp(this.health, 0, Player.baseHealth);
    this.energy = Math.clamp(this.energy, 0, Player.baseEnergy);
    // Clamp player position
    this.setPositionY(Math.clamp(this.getPositionY(), Player.positionMinimumY, Player.positionMaximumY));
    // Clamp score
    this.score = Math.clamp(this.score, 0, Player.maxScore);
  }

  /**
   * @override
   * @virtual
   */
  draw() {
    /** @type {CanvasRenderingContext2D} */
    let context = ig.system.context;
    // Draw debug lines, if debugging
    if (Game.debug) {
      let playerMinY = Player.positionMinimumY - (Player.height / 2);
      let playerMaxY = Player.positionMaximumY + (Player.height / 2);
      context.lineWidth = 1;
      context.strokeStyle = this.colour;
      context.beginPath();
      context.moveTo(this.getPositionX(), playerMinY);
      context.lineTo(this.getPositionX(), playerMaxY);
      context.stroke();
      context.beginPath();
      context.moveTo(this.getPositionX() - (Player.width / 2), playerMinY);
      context.lineTo(this.getPositionX() + (Player.width / 2), playerMinY);
      context.stroke();
      context.beginPath();
      context.moveTo(this.getPositionX() - (Player.width / 2), playerMaxY);
      context.lineTo(this.getPositionX() + (Player.width / 2), playerMaxY);
      context.stroke();
    }
    super.draw();
    this.drawPlayerBar(context);
    for (let i = 0; i < this.buffs.length; i++) {
      this.buffs[i].onDraw(context);
    }
  }
  
  /**
   * @abstract
   * @param {CanvasRenderingContext2D} context
   */
  drawPlayerBar(context) {}
  
  /**
   * @param {Buff} buff
   * @returns {Buff}
   */
  hasBuff(buff) {
    // Ensure a constructor
    if (typeof buff !== "function") {
      if (!(buff instanceof Buff)) {
        return null;
      }
      buff = buff.constructor;
    }
    // Go through buffs and see if constructors match
    for (let i = 0; i < this.buffs.length; i++) {
      if (buff === this.buffs[i].constructor) {
        return this.buffs[i];
      }
    }
    // Otherwise return nothing
    return null;
  }
  
  /**
   * @param {Buff} buff
   * @param {Player} from
   */
  applyBuff(buff, from) {
    if (this.isBuffable) {
      let existing = this.hasBuff(buff);
      if (existing !== null) {
        existing.onApply(true);
      }
      else {
        buff = Buff.instantiateBuff(buff);
        if (buff !== null) {
          buff.player = this;
          buff.from = from;
          buff.onApply(false);
          this.buffs.push(buff);
        }
      }
    }
  }
  
  /** @param {Buff} buff */
  removeBuff(buff) {
    let existing = this.hasBuff(buff);
    if (existing != null) {
      this.buffs.erase(existing);
    }
  }
  
  flushBuffs() {
    this.buffs = [];
  }
  
  /** @param {Function} spawner */
  addAmmunition(spawner) {
    this.ammunition.push(spawner);
  }

  fire() {
    ig.game.spawnEntity(Player.ammunition, this.firePositionX(), this.getPositionY(), this);
  }
  
  /**
   * @abstract
   * @returns {number}
   */
  firePositionX() {
    throw new Error("Not implemented!");
  }

  /**
   * @abstract
   * @returns {number}
   */
  lookDirection() {
    throw new Error("Not implemented!");
  }

  /**
   * @override
   * @param {number} amount 
   * @param {Entity} from 
   */
  receiveDamage(amount, from) {
    if (this.isDamageable) {
      this.health -= amount;
      this.events.emit("damaged", this, amount, from);
      if (from instanceof Player) {
        from.events.emit("dealt", from, amount, this);
      }
      if (this.health <= 0) {
        this.applyBuff(BuffOfDeath, this);
        if (from instanceof Player) {
          from.events.emit("killed", this); 
        }
      }
    }
  }

}

// Game
Player.positionMargin = 0; // Will be set by main.js
Player.playerOneX = 0; // Will be set by main.js
Player.playerTwoX = 0; // Will be set by main.js
Player.positionMinimumY = 0; // Will be set by main.js
Player.positionMaximumY = 0; // Will be set by main.js
Player.maxScore = 999;

// Engine
Player.width = 30.0;
Player.height = 45.0;
Player.maxVelY = 600.0;

// Bar
Player.healthBarColour = "#00CC33";
Player.energyBarColour = "#E68E00";
Player.statusBarWidth = 200.0;
Player.statusBarHeight = 3.0;
Player.buffDisplaySize = 15.0;
Player.scoreDisplaySize = 25.0;

// Base stats
Player.baseHealth = 100.0;
Player.baseEnergy = 100.0;
Player.baseHealthRegeneration = 5.0;
Player.baseEnergyRegeneration = 40.0;
Player.baseMovementSpeed = 200.0;

// Base tags
Player.defaultMovability = true;
Player.defaultActivity = true;
Player.defaultTargetability = true;
Player.defaultDamageability = true;
Player.defaultRegenerateHealth = true;
Player.defaultRegenerateEnergy = true;
Player.defaultHaveMovementCosts = true;
Player.defaultHaveActivityCosts = true;
Player.defaultWeaponStatus = true;
Player.defaultBuffability = true;

// Static parameters
Player.movementCost = 30.0;
Player.activityCost = 10.0;
Player.exhaustionThreshold = 10.0;
Player.ammunition = EntityBullet;