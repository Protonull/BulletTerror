import {Buff} from "../core/buff";

export class BuffOfAgony extends Buff {
  
  constructor() {
    super();
    this.name = "Curse!";
    this.description = "Curses the target with agony, damaging them over time!";
    this.targets = Buff.TARGET.OTHER;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 0, y: 0, width: 50, height: 50};
    this.damage = 20;
  }

  onApply(reapply) {
    this.lifespan = 2.0; // Two seconds of agony
  }

  onUpdate() {
    this.player.receiveDamage(this.damage * ig.system.tick, this.from);
  }

}