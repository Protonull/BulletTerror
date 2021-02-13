import {Game} from "../main";
import {Buff} from "../core/buff";

export class BuffOfChains extends Buff {
  
  constructor() {
    super();
    this.name = "Hooked!";
    this.description = "Drags the unfortunate soul towards the centre of their zone.";
    this.targets = Buff.TARGET.OTHER;
    this.removal = Buff.REMOVE.LIFESPAN;
    this.lifespan = 0;
    this.icon = {x: 250, y: 50, width: 50, height: 50};
    this.color = "#1b602b";
    this.chainPos = {x: 0, y: 0};
  }
  
  onApply(reapply) {
    this.lifespan += 1.7; // One and a bit seconds of chainage
    this.chainPos.x = this.player.getPositionX();
    this.chainPos.y = Game.height / 2;
  }

  onUpdate() {
    // Prevent player from moving
    this.player.isMovable = false;
    // If player is above chain, drag player down
    if (this.player.getPositionY() < (this.chainPos.y - 10)) {
      this.player.vel.y = 30;
    }
    else if (this.player.getPositionY() > (this.chainPos.y + 10)) {
      this.player.vel.y = -30;
    }
    else {
      this.removal = Buff.REMOVE.NOW;
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  onDraw(context) {
    // Render bullet
    context.save();
    context.beginPath();
    context.lineWidth = 10;
    context.strokeStyle = this.color;
    context.setLineDash([20, 20]);
    context.moveTo(this.chainPos.x, this.chainPos.y);
    context.lineTo(this.player.getPositionX(), this.player.getPositionY());
    context.stroke();
    context.restore();
  }
  
}