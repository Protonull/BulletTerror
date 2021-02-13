ig.require("impact.game");

import {GameAsset} from "./core/images";
import {Player} from "./core/player";
import {Entity} from "./core/entity";
import {EntityPlayerOne} from "./players/player1";
import {EntityPlayerTwo} from "./players/player2";
import {EntityBuff} from "./core/buff";
import {BuffSpawner} from "./core/buff";
import {BuffOfAftershock} from "./buffs/BuffOfAftershock";
import {BuffOfAgony} from "./buffs/BuffOfAgony";
import {BuffOfBombage} from "./buffs/BuffOfBombage";
import {BuffOfChains} from "./buffs/BuffOfChains";
import {BuffOfCover} from "./buffs/BuffOfCover";
import {BuffOfDodge} from "./buffs/BuffOfDodge";
import {BuffOfHealing} from "./buffs/BuffOfHealing";
import {BuffOfHell} from "./buffs/BuffOfHell";
import {BuffOfMissiles} from "./buffs/BuffOfMissiles";
import {BuffOfNetting} from "./buffs/BuffOfNetting";
import {BuffOfOvercharge} from "./buffs/BuffOfOvercharge";
import {BuffOfProtection} from "./buffs/BuffOfProtection";
import {BuffOfPurgatory} from "./buffs/BuffOfPurgatory";
import {BuffOfSlowness} from "./buffs/BuffOfSlowness";
import {BuffOfSniperage} from "./buffs/BuffOfSniperage";
import {BuffOfSpeed} from "./buffs/BuffOfSpeed";
import {BuffOfStatic} from "./buffs/BuffOfStatic";

export class Game extends ig.Game {

  init () {
    // Pseudo board entity, for entity.touches(other)
    this.board = {
      pos: {x: 0, y: 0},
      size: {x: Game.width, y: Game.height}
    };
    // Load assets
    this.spriteMain = new GameAsset(500, 150, "media/sprite.png");
    this.spriteExplosion = new GameAsset(900, 900, "media/explosion.png");
    this.spriteBackground = new GameAsset(900, 900, "media/background.png");
    // Create buff spawner
    this.buffSpawner = new class extends BuffSpawner {
      constructor() {
        super();
        this.registerBuff(BuffOfAftershock);
        this.registerBuff(BuffOfAgony);
        this.registerBuff(BuffOfBombage);
        this.registerBuff(BuffOfChains);
        this.registerBuff(BuffOfCover);
        this.registerBuff(BuffOfDodge);
        this.registerBuff(BuffOfHealing);
        this.registerBuff(BuffOfHell);
        this.registerBuff(BuffOfMissiles);
        this.registerBuff(BuffOfNetting);
        this.registerBuff(BuffOfOvercharge);
        this.registerBuff(BuffOfProtection);
        this.registerBuff(BuffOfPurgatory);
        this.registerBuff(BuffOfSlowness);
        this.registerBuff(BuffOfSniperage);
        this.registerBuff(BuffOfSpeed);
        this.registerBuff(BuffOfStatic);
      }
      /** @override */
      getSpawnX() {
        return EntityBuff.spawnX;
      }
      /** @override */
      getSpawnY() {
        return Math.randomInt(EntityBuff.spawnMinimumY, EntityBuff.spawnMaximumY);
      }
    };
    // Spawn Player
    this.playerOne = ig.game.spawnEntity(EntityPlayerOne, Player.playerOneX, Game.height / 2);
    this.playerTwo = ig.game.spawnEntity(EntityPlayerTwo, Player.playerTwoX, Game.height / 2);
    // Call post-init ready function on all entities
		for(let i = 0; i < this.entities.length; i++) {
			this.entities[i].ready();
		}
  }

  update () {
    super.update();
    this.buffSpawner.update();
  }

  draw ()  {
    /** @type {CanvasRenderingContext2D} */
    let context = ig.system.context;
    /* Clear Canvas */
    if(this.clearColor) {
      ig.system.clear(this.clearColor);
    }
    /* Background */
    if (this.spriteBackground.hasLoaded() === true) {
      context.drawImage(this.spriteBackground.get(), 0, 0, 700, 442, -50, -21, 700, 442);
    }
    /* UI DEBUG */
    if (Game.debug === true) {
      /* Buff Spawn Area */
      let buffMinY = EntityBuff.spawnMinimumY - (EntityBuff.size / 2);
      let buffMaxY = EntityBuff.spawnMaximumY + (EntityBuff.size / 2);
      context.lineWidth = 1;
      context.strokeStyle = "#00FF00";
      context.beginPath();
      context.moveTo(EntityBuff.spawnX, buffMinY);
      context.lineTo(EntityBuff.spawnX, buffMaxY);
      context.stroke();
      context.beginPath();
      context.moveTo(EntityBuff.spawnX - (EntityBuff.size / 2), buffMinY);
      context.lineTo(EntityBuff.spawnX + (EntityBuff.size / 2), buffMinY);
      context.stroke();
      context.beginPath();
      context.moveTo(EntityBuff.spawnX - (EntityBuff.size / 2), buffMaxY);
      context.lineTo(EntityBuff.spawnX + (EntityBuff.size / 2), buffMaxY);
      context.stroke();
    }
    this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
    this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
    this.entities.sort(function (a, b) {
      return a.zIndex < b.zIndex ? -1 : b.zIndex < a.zIndex ? 1: 0;
    });
    this.drawEntities();
  }

  /** @param {Function} type */
  getEntitiesOfType(type) {
    /** @type {Entity[]} */
    var result = [];
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i] instanceof type) {
        result.push(this.entities[i]);
      }
    }
    return result;
  }

}

// Game
Game.width = 600;
Game.height = 400;

// Engine
Game.debug = false;

// Players
Player.positionMargin = 30;
Player.playerOneX = Player.positionMargin;
Player.playerTwoX = Game.width - Player.positionMargin;
Player.positionMinimumY = Player.positionMargin + Player.height / 2;
Player.positionMaximumY = Game.height - Player.positionMargin - Player.height / 2;

// Buffs
EntityBuff.spawnX = Game.width / 2;
EntityBuff.spawnMinimumY = Game.height / 4;
EntityBuff.spawnMaximumY = Game.height - EntityBuff.spawnMinimumY;

ig.main("#canvas", Game, 60, Game.width, Game.height, 1);