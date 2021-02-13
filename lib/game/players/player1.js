import {Player} from "../core/player";
import {GameAsset} from "../core/images";
import {Score} from "../core/score";

export class EntityPlayerOne extends Player {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    super(x, y, ig.KEY.W, ig.KEY.S, ig.KEY.SPACE);
    this.name = "Blue";
    this.angle.x = 1; // Shoot right
    this.type = ig.Entity.TYPE.A;
    this.checkAgainst = ig.Entity.TYPE.B;
    this.colour = "#0099FF";
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
    context.fillStyle = Player.healthBarColour;
    let healthWidthScalar = Math.normalise(Math.clamp(this.health, 1, Player.baseHealth), 0, Player.baseHealth);
    context.fillRect(0, 0, Player.statusBarWidth * healthWidthScalar, 3);
    context.stroke();
    /* Display Energy */
    context.beginPath();
    context.fillStyle = Player.energyBarColour;
    let energyWidthScaler =  Math.normalise(Math.clamp(this.energy, 1, Player.baseEnergy), 0, Player.baseEnergy);
    context.fillRect(0, 2, Player.statusBarWidth * energyWidthScaler, 3);
    context.stroke();
    /* Display Score */
    let scoreIcons = Score.convertScoreToIcon(this.score);
    for (let i = 0; i < scoreIcons.length; i++) {
      let scorePosX = Player.statusBarWidth + i * Player.scoreDisplaySize;
      /** @type {GameAsset} */
      let iconImage = ig.game.spriteMain.getArea(scoreIcons[i].x, scoreIcons[i].y, scoreIcons[i].width, scoreIcons[i].height);
      context.drawImage(iconImage, 0, 0, 50, 50, scorePosX, 0, Player.scoreDisplaySize, Player.scoreDisplaySize);
    }
    /* Display Buffs */
    for (let i = 0, j = 0; i < this.buffs.length; i++) {
      if (!this.buffs[i].hidden) {
        let buffPosX = Player.statusBarWidth - (++j) * Player.buffDisplaySize;
        let buffIcon = this.buffs[i].icon;
        /** @type {GameAsset} */
        let iconImage = ig.game.spriteMain.getArea(buffIcon.x, buffIcon.y, buffIcon.width, buffIcon.height);
        context.drawImage(iconImage, 0, 0, 50, 50, buffPosX, 6, Player.buffDisplaySize, Player.buffDisplaySize);
      }
    }
  }

  /** @override */
  firePositionX() {
    return this.pos.x + this.size.x;
  }

  /** @override */
  lookDirection() {
    return 1;
  }

}