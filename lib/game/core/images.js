ig.require("impact.entity");

var assetCounter = 0;

export class GameAsset {

  /**
   * @param {number} width 
   * @param {number} height 
   * @param {string} url 
   */
  constructor(width, height, url) {
    this.name += ++assetCounter;
    /** @type {Object.<string, HTMLCanvasElement>} */
    this.areaCache = {};
    // Use IMPACT's image loader
    this.image = ig.Image.cache.hasOwnProperty(url) ? ig.Image.cache[url] : new ig.Image(url);
    // Set up a hidden canvas to store the image
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    // Wait for the image to be loaded, with a ten second timeout
    var waitingPeriod = 10; // 10ms
    var waitingTimeout = waitingPeriod * 1000; // 10s
    var waitUntilLoaded = setInterval((() => {
      // Check if the image has laded
      if (this.image.loaded === true) {
        clearInterval(waitUntilLoaded);
        var context = this.canvas.getContext("2d");
        context.drawImage(this.image.data, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
      }
      // Otherwise decrement timer, timimg out if necessary
      else {
        waitingTimeout -= waitingPeriod;
        if (waitingTimeout <= 0) {
          clearInterval(waitUntilLoaded);
          ig.game.removeEntity(this);
          throw new Error("Image load timeout.");
        }
      }
    }).bind(this), waitingPeriod);
  }

  hasLoaded() {
    return this.image && this.image.loaded === true;
  }

  /**
   * @returns {HTMLCanvasElement} Image canvas, may be empty!
   */
  get() {
    return this.canvas;
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  getArea(x, y, width, height) {
    // If the image has loaded, then it's allowed to have an area cache
    // (Otherwise you have an area cache for literally nothing.)
    if (this.image.loaded === true) {
      var areaId = "(" + x + "," + y + ":" + width + "," + height + ")";
      // // If this area already exists within the cache, just return it
      // if (this.areaCache.hasOwnProperty(areaId)) {
      //   return this.areaCache[areaId];
      // }
      // Create a new canvas
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      // Draw the image to the new canvas
      // (The longer call is not *necessary* but better to be specific imo)
      context.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
      this.areaCache[areaId] = canvas;
      return canvas;
    }
    else {
      // Image is not loaded, so just create an empty canvas
      return document.createElement("canvas");;
    }
  }

}