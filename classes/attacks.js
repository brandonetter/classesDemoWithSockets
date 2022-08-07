class Attacks {
  static instances = [];
  constructor(name = Math.random() * 10, position = [0, 0], timeToLive = 1) {
    this.position = position;
    this.name = name;
    this.timeToLive = timeToLive;
    Attacks.instances.push(this);
  }
  static getAttacks() {
    return Attacks.instances;
  }
  destroy() {
    Attacks.instances.splice(Attacks.instances.indexOf(this), 1);
    delete this;
  }
}
module.exports.Attacks = Attacks;
