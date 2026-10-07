class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    var length = Math.sqrt(this.x * this.x + this.y * this.y);

    // so we dont divide w/ 0
    if (length > 0) {

      // normalization happens here
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  // --- POLYMORPHIC IMMUTABLE MATH ---

  add(value = 0) {
    // Check if the value is another Vector2
    if (value instanceof Vector2) {
      return new Vector2(this.x + value.x, this.y + value.y);
    }
    // Otherwise, assume it's a standard number
    return new Vector2(this.x + value, this.y + value);
  }

  multiply(value = 1) {
    if (value instanceof Vector2) {
      return new Vector2(this.x * value.x, this.y * value.y);
    }
    return new Vector2(this.x * value, this.y * value);
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}
