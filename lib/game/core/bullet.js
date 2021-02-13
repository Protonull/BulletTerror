ig.requires("impact.entity");

import {Entity} from "./entity";
import {Player} from "./player";

export const BulletDefaults = {
  width: 7,
  height: 5,

  speed: 400,
  maxVel: {x: 1000, y: 1000},

  damage: 20
};

export class EntityBullet extends Entity {

  /**
   * @override
   * @param {number} x 
   * @param {number} y 
   * @param {Player} player
   */
  constructor(x, y, player) {
    super(x, y, {
      size: {x: BulletDefaults.width, y: BulletDefaults.height},
      vel: {x: player.angle.x * BulletDefaults.speed, y: 0},
      maxVel: BulletDefaults.maxVel,
      zIndex: 8,
      type: player.type,
      checkAgainst: player.checkAgainst
    });
    this.drawBullet = true;
    this.color = "#000";
    this.player = player;
    this.damage = BulletDefaults.damage;
    this.ignoreBuffs = false;
  }

  /** @param {Entity} other */
  onCollisionEnter(other) {
    if (!(other instanceof Player)) {
      return;
    }
    if (other === this.player) {
      return;
    }
    other.receiveDamage(this.damage, this.player);
    ig.game.removeEntity(this);
  }

  update() {
    super.update();
    if (!this.touches(ig.game.board)) {
      ig.game.removeEntity(this);
    }
  }

  draw() {
    super.draw();
    /** @type {CanvasRenderingContext2D} */
    let context = ig.system.context;
    if (this.drawBullet) {
      context.beginPath();
      context.fillStyle = this.color;
      context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
      context.stroke();
    }
  }

}























ig.module (
  "game.entities.bullet"
)
.requires(
  "impact.entity"
)
.defines(function(){
  var EntityBullets = ig.Entity.extend({
      name: "Bullet",
      collides: ig.Entity.COLLIDES.NEVER,
      size: { x: 7, y: 5 },
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      maxVel: { x: 400, y: 400 },
      angle: 0,
      speed: 400,
      damage: 5,
      exploding: 0,
      canDamage: 1,
      deathCount: 0,
      animSheet: new ig.AnimationSheet("media/explosion.png", 100, 100 ),
      check: function ( entity ) {
          if ( this.canDamage == 1 ) {
              entity.receiveDamage( this.damage );
              this.canDamage = 0;
          }
          if ( this.damage >= 50 ) {
              if ( this.exploding == 0 ) {
                  this.vel.x = 0;
                  this.vel.y = 0;
                  this.pos.x = entity.pos.x - 50;
                  this.pos.y -= 50;
                  this.size.x = 100;
                  this.size.y = 100;
                  this.currentAnim = this.anims.explode;
                  this.exploding = 1;
              }
          }
          else {
              this.kill();
          }
          this.checkAgainst = null;
      },
      init: function ( x, y, settings ) {
          this.name = "Bullet_" + Math.randomInt( 1, 10000 );
          x = parseFloat ( String( x ).replace( /[^\d.-]/g, "" ) ) || 0;
          y = parseFloat ( String( y ).replace( /[^\d.-]/g, "" ) ) || 0;
          settings = settings instanceof Object ? settings : {};
          this.pos.x = x;
          this.pos.y = y;
          this.speed = typeof settings.speed == "number" ? settings.speed : this.speed;
          this.angle = typeof settings.angle == "number" ? settings.angle : this.angle;
          this.vel.x = Math.cos( this.angle ) * this.speed;
          this.vel.y = Math.sin( this.angle ) * this.speed;
          this.checkAgainst = typeof settings.checkAgainst == "number" ? settings.checkAgainst : null;
          if ( this.checkAgainst == null ) {
              this.checkAgainst = this.vel.x < 0 ? ig.Entity.TYPE.A : ig.Entity.TYPE.B;
          }
          this.type = this.checkAgainst == 1 ? 2 : 1;
          this.damage = typeof settings.damage == "number" ? settings.damage : this.damage;
          this.size.x = this.damage * .7;
          this.size.y = this.damage * .5;
          this.addAnim( "explode", 0.03, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,72,73,74], true );
          this.currentAnim = null;
    },
      update: function () {
          this.parent();
          if ( this.pos.x < 0 - this.size.x / 2 || this.pos.x > ig.system.width + this.size.x / 2 ) ig.game.removeEntity( this );
          if ( this.pos.y < 0 - this.size.y / 2 || this.pos.y > ig.system.height + this.size.y / 2 ) ig.game.removeEntity( this );
          if ( this.exploding == 0 ) {
              if ( this.damage >= 50 ) {
                  if ( this.checkAgainst == ig.Entity.TYPE.A ) {
                      if ( this.pos.x > 0 && this.pos.x < 40 ) {
                          this.exploding = 1;
                          this.vel.x = 0;
                          this.vel.y = 0;
                          this.pos.x -= ( 100 - this.pos.x ) / 50;
                          this.pos.y -= ( 100 - this.pos.y ) / 50;
                          this.size.x = 100;
                          this.size.y = 100;
                          this.currentAnim = this.anims.explode;
                      }
                  }
                  if ( this.checkAgainst == ig.Entity.TYPE.B ) {
                      if ( this.pos.x < ig.system.width && this.pos.x > ig.system.width - 40 ) {
                          this.exploding = 1;
                          this.vel.x = 0;
                          this.vel.y = 0;
                          this.size.x = 100;
                          this.size.y = 100;
                          this.pos.x -= 50;
                          this.pos.y -= 50;
                          this.currentAnim = this.anims.explode;
                      }
                  }
              }
          }
          if ( this.exploding == 1 ) {
              this.deathCount += ig.system.tick;
              if ( this.deathCount > 1000 ) this.canDamage = 0;
              if ( this.deathCount > 10000 ) ig.game.removeEntity( this );
          }
      },
      draw: function () {
          if ( this.currentAnim ) {
              this.currentAnim.draw(
                  this.pos.x - this.offset.x - ig.game._rscreen.x,
                  this.pos.y - this.offset.y - ig.game._rscreen.y
              )
          }
          else {
              var ctx = ig.system.context;
              ctx.save();
              ctx.translate( this.pos.x, this.pos.y );
              ctx.rotate( this.angle );
              ctx.beginPath();
              ctx.fillStyle = "#000";
              ctx.fillRect( 0 - this.size.x / 2, 0 - this.size.y / 2, this.size.x * 0.9, this.size.y * 0.5 );
              ctx.stroke();
              ctx.restore();
          }
      }
  });
});