export const Easing = {
  Linear: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseNone: function ( k ) {
      return k;
    }
  },
  Quadratic: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return k * k;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return - k * ( k - 2 );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
      return - 0.5 * ( --k * ( k - 2 ) - 1 );
    }
  },
  Cubic: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return k * k * k;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return --k * k * k + 1;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k + 2 );
    }
  },
  Quartic: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return k * k * k * k;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return - ( --k * k * k * k - 1 );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
      return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
    }
  },
  Quintic: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return k * k * k * k * k;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return ( k = k - 1 ) * k * k * k * k + 1;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
    }
  },
  Sinusoidal: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return - Math.cos( k * Math.PI / 2 ) + 1;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return Math.sin( k * Math.PI / 2 );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );
    }
  },
  Exponential: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return k === 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
      return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
    }
  },
  Circular: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function ( k ) {
      return - ( Math.sqrt( 1 - k * k ) - 1);
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function ( k ) {
      return Math.sqrt( 1 - (--k * k) );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function ( k ) {
      if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
      return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
    }
  },
  Elastic: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function( k ) {
      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0; if ( k === 1 ) return 1; if ( !p ) p = 0.3;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
      return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function( k ) {
      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0; if ( k === 1 ) return 1; if ( !p ) p = 0.3;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
      return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function( k ) {
      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0; if ( k === 1 ) return 1; if ( !p ) p = 0.3;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
      if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
      return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
    }
  },
  Back: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function( k ) {
      var s = 1.70158;
      return k * k * ( ( s + 1 ) * k - s );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function( k ) {
      var s = 1.70158;
      return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function( k ) {
      var s = 1.70158 * 1.525;
      if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
      return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
    }
  },
  Bounce: {
    /**
     * @param {number} k
     * @return {number}
     */
    EaseIn: function( k ) {
      return 1 - ig.Tween.Easing.Bounce.EaseOut( 1 - k );
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseOut: function( k ) {
      if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
        return 7.5625 * k * k;
      } else if ( k < ( 2 / 2.75 ) ) {
        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
      } else if ( k < ( 2.5 / 2.75 ) ) {
        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
      } else {
        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
      }
    },
    /**
     * @param {number} k
     * @return {number}
     */
    EaseInOut: function( k ) {
      if ( k < 0.5 ) return ig.Tween.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
      return ig.Tween.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;
    }
  }
};