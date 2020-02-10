class Human {
  constructor(x, y, steps, position) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.steps = steps;
    this.position = position;
  }
  // // Getter
  // get area() {
  //   return this.calcArea();
  // }
  // Method
  setCoordinates(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  goBack() {
    this.position = Math.max(0, this.position - 1)
    this.setCoordinates(this.steps[this.position])
  }

  hasArrived() {
    return this.position === (this.steps.length - 1)
  }
}

export default Human;
