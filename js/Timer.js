class Timer {
  constructor({ start, stop, onUpdate, onComplete }) {
    this.startValue = start;
    this.stopValue = stop;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;

    this.currentValue = start;
    this.isRunning = false;
    this.startTime = null;
    this.elapsedAtPause = 0;
    this.direction = stop > start ? 1 : -1;
    this.requestId = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = performance.now();
    this.tick();
  }

  pause() {
    this.isRunning = false;
    cancelAnimationFrame(this.requestId);
    // Save how much time passed so we can resume accurately
    this.elapsedAtPause += (performance.now() - this.startTime) / 1000;
  }

  reset() {
    this.pause();
    this.currentValue = this.startValue;
    this.elapsedAtPause = 0;
    if (this.onUpdate) this.onUpdate(this.currentValue);
  }

  updateSettings(newStart, newStop = this.stopValue) {
    this.startValue = newStart;
    this.stopValue = newStop;
    
    // Recalculate if we are counting up or down
    this.direction = this.stopValue > this.startValue ? 1 : -1;
    
    // Reset the timer to the new starting point
    this.reset();
  }

  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const sessionElapsed = (now - this.startTime) / 1000;
    const totalElapsed = this.elapsedAtPause + sessionElapsed;

    // Calculate current position
    this.currentValue = this.startValue + (totalElapsed * this.direction);

    // Check if we've reached or passed the stop value
    const reachedEnd = this.direction === 1 
      ? this.currentValue >= this.stopValue 
      : this.currentValue <= this.stopValue;

    if (reachedEnd) {
      this.currentValue = this.stopValue;
      if (this.onUpdate) this.onUpdate(this.currentValue);
      this.isRunning = false;
      if (this.onComplete) this.onComplete();
      return;
    }

    if (this.onUpdate) this.onUpdate(this.currentValue);
    this.requestId = requestAnimationFrame(() => this.tick());
  }
}