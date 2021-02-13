ig.requires("impact.entity");

export class Entity extends ig.Entity {

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {object} options 
   */
  constructor(x, y, options) {
    super(-Infinity, -Infinity, options);
    this.name = "Entity" + this.id;
    this.setPositionX(x);
    this.setPositionY(y);
    /** @type {Entity[]} */
    this.collidingWith = [];
  }

  /**
   * Gets the centre X position.
   * @returns {number}
   */
  getPositionX() {
    return this.pos.x + (this.size.x / 2);
  }
  
  /**
   * Gets the centre Y position.
   * @returns {number}
   */
  getPositionY() {
    return this.pos.y + (this.size.y / 2);
  }
  
  /**
   * Set's the centre X position.
   * @param {number} x
   */
  setPositionX(x) {
    this.pos.x = x - (this.size.x / 2);
  }
  
  /**
   * Set's the centre Y position.
   * @param {number} y
   */
  setPositionY(y) {
    this.pos.y = y - (this.size.y / 2);
  }

  /** @override */
  update() {
    super.update();
    for (let i = 0; i < this.collidingWith.length; i++) {
      let other = this.collidingWith[i];
      if (!this.touches(other)) {
        this.onCollisionExit(other);
        this.collidingWith.splice(i, 1);
      }
    }
  }
  
  /** @override */
  check(other) {
    if (this.collidingWith.indexOf(other) < 0) {
      this.collidingWith.push(other);
      this.onCollisionEnter(other);
    }
    this.onCollisionUpdate(other);
  }

  /** @param {Entity} other */
  onCollisionEnter(other) {}

  /** @param {Entity} other */
  onCollisionExit(other) {}

  /** @param {Entity} other */
  onCollisionUpdate(other) {}

}