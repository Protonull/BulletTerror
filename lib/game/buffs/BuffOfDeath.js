import {Buff} from "../core/buff";
import {Player} from "../core/player";

export class BuffOfDeath extends Buff {
  
  constructor() {
    super();
    this.name = "You be dead.";
    this.description = "Revives the target, resetting their health and making them immune to damage for a short time.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 400, y: 0, width: 50, height: 50};
  }
  
  onApply(reapply) {
    // Two seconds of revival
    this.lifespan = 2.5;
    // Remove all other buffs
    this.player.flushBuffs();
    // Set no health and energy
    this.player.health = 0;
    // Set player as dead
    this.player.dead = true;
    // Emit revival event
    this.player.events.emit("dead", this.player, true);
  }

  onUpdate() {
    this.player.isDamageable = false;
    this.player.isRegeneratingHealth = false;
    this.player.isBuffable = false;
  }

  onEnd() {
    // Reset health and energy
    this.player.health = Player.baseHealth;
    // Reset player deadness
    this.player.dead = false;
    // Emit revival event
    this.player.events.emit("dead", this.player, false);
  }

}