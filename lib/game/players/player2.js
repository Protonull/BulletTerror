import {Game} from "../main";
import {Player} from "../core/player";
import {GameAsset} from "../core/images";
import {Score} from "../core/score";

export class EntityPlayerTwo extends Player {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    super(x, y, ig.KEY.UP_ARROW, ig.KEY.DOWN_ARROW, ig.KEY.ENTER);
    this.name = "Red";
    this.angle.x = -1; // Shoot left
    this.type = ig.Entity.TYPE.B;
    this.checkAgainst = ig.Entity.TYPE.A;
    this.colour = "#FF0033";
  }

  /** @override */
  draw() {
    super.draw();
    /** @type {CanvasRenderingContext2D} */
    var context = ig.system.context;
    /* Display Player */
    context.beginPath();
    context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    context.fillStyle = this.colour;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "#000";
    context.stroke();
  }
  
  /**
   * @override
   * @param {CanvasRenderingContext2D} context
   */
  drawPlayerBar(context) {
    /* Display Health */
    context.beginPath();
    context.fillStyle = "#00CC33";
    var barWidth = 200 * Math.normalise(Math.clamp(this.health, 1, Player.baseHealth), 0, 100);
    context.fillRect(Game.width - barWidth, 0, barWidth, 3);
    context.stroke();
    /* Display Energy */
    context.beginPath();
    context.fillStyle = "#E68E00";
    var barWidth = 200 * Math.normalise(Math.clamp(this.energy, 1, Player.baseEnergy), 0, 100);
    context.fillRect(Game.width - barWidth, 2, barWidth, 3);
    context.stroke();
    /* Display Score */
    var scoreIcons = Score.convertScoreToIcon(this.score);
    for (let i = 0; i < scoreIcons.length; i++) {
      let scorePosX = Game.width - Player.statusBarWidth - (scoreIcons.length - i) * Player.scoreDisplaySize;
      /** @type {GameAsset} */
      let iconImage = ig.game.spriteMain.getArea(scoreIcons[i].x, scoreIcons[i].y, scoreIcons[i].width, scoreIcons[i].height);
      context.drawImage(iconImage, 0, 0, 50, 50, scorePosX, 0, Player.scoreDisplaySize, Player.scoreDisplaySize);
    }
    /* Display Buffs */
    for (let i = 0, j = 0; i < this.buffs.length; i++) {
      if (!this.buffs[i].hidden) {
        let buffPosX = Game.width - Player.statusBarWidth + (j++) * Player.buffDisplaySize;
        let buffIcon = this.buffs[i].icon;
        /** @type {GameAsset} */
        let iconImage = ig.game.spriteMain.getArea(buffIcon.x, buffIcon.y, buffIcon.width, buffIcon.height);
        context.drawImage(iconImage, 0, 0, 50, 50, buffPosX, 6, Player.buffDisplaySize, Player.buffDisplaySize);
      }
    }
  }

  /** @override */
  firePositionX() {
    return this.pos.x;
  }

  /** @override */
  lookDirection() {
    return -1;
  }

}