const { Attacks } = require("./attacks");
class Enemies {
  static instances = [];
  static deadInstances = [];
  constructor(
    position = [0, 0],
    name = "Goblin",
    moveTime = 12000,
    health = 3,
    defaultMoveTime = moveTime
  ) {
    this.position = position;
    //Give the name a unique identifier so that the client can refer to them by Name
    this.name = name + Math.floor(Math.random() * 1000);
    this.moveTime = moveTime;
    this.defaultMoveTime = defaultMoveTime;
    this.health = health;
    Enemies.instances.push(this);
  }
  move(x, y) {
    this.position[0] += x;
    this.position[1] += y;
    //keep movement in bounds
    if (this.position[0] < -10) this.position[0] = -10;
    if (this.position[0] > 10) this.position[0] = 10;
    if (this.position[1] < -10) this.position[1] = -10;
    if (this.position[1] > 10) this.position[1] = 10;
  }
  checkHit() {
    const attacks = Attacks.getAttacks();
    for (let i of attacks) {
      if (
        this.position[0] == i.position[0] &&
        this.position[1] == i.position[1]
      ) {
        this.health -= 1;
      }
    }
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    Enemies.instances.splice(Enemies.instances.indexOf(this), 1);
    Enemies.deadInstances.push(this);
    delete this;
    console.log(Enemies.deadInstances);
  }
  static getDeadInstances() {
    return Enemies.deadInstances;
  }
  static getPositions() {
    return Enemies.instances;
  }
  static getEnemies() {
    return Enemies.instances;
  }
}
module.exports.Enemies = Enemies;
