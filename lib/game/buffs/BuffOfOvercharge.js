import {Buff} from "../core/buff";

export class BuffOfOvercharge extends Buff {
  
  constructor() {
    super();
    this.name = "Double Buffs";
    this.description = "Will double the current charges and lifespan of all buffs currently held by the player.";
    this.targets = Buff.TARGET.SELF;
    this.removal = Buff.REMOVE.NOW;
    this.icon = {x: 400, y: 50, width: 50, height: 50};
  }
  
  onApply(reapply) {
    for (let i = 0; i < this.player.buffs.length; i++) {
      let buff = this.player.buffs[i];
      if (buff.lifespan > 0) {
        buff.lifespan *= 2;
      }
      if (buff.charges > 0) {
        buff.charges *= 2;
      }
    }
  }

}