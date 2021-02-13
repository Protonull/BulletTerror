import {Buff} from "../core/buff";
import {Player} from "../core/player";

export class BuffOfExhaustion extends Buff {
  
  constructor() {
    super();
    this.name = "Exhausted";
    this.description = "Low energy means moving slower!";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.NEVER;
    this.icon = {x: 350, y: 0, width: 50, height: 50};
    this.hidden = true;
    this.exhausted = false;
  }
  
  onUpdate() {
    if (this.player.energy <= Player.exhaustionThreshold) {
      this.player.maxVel.y = Player.baseMovementSpeed * 0.1;
      this.hidden = false;
      if (!this.exhausted) {
        this.player.events.emit("exhausted", this.player, true);
        this.exhausted = true;
      }
    }
    else {
      this.hidden = true;
      if (this.exhausted) {
        this.player.events.emit("exhausted", this.player, false);
        this.exhausted = false;
      }
    }
  }
  
}