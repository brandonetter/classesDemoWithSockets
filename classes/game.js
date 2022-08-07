const { Enemies } = require("./enemies");
const { Attacks } = require("./attacks");
const { Rooms } = require("./rooms");
class Game {
  constructor(moveTime = 100, socket) {
    this.moveTime = moveTime;
    this.socket = socket;
  }
  init() {
    //Gameloop runs at the speed given near the top of Index.js
    setInterval(() => this.GameLoop(), this.moveTime);

    //create 3 goblins, they will automatically move around and die when hit
    const Goblin1 = new Enemies();
    const Goblin2 = new Enemies();
    const Goblin3 = new Enemies();

    const Room1 = new Rooms(0, [10, 10], [10, 10], 1);
    const Room2 = new Rooms(1, [-10, 10], [-9, 10], 0);
  }
  setRooms() {
    this.socket.emit("roomExit", Rooms.rooms);
  }
  createAttack(userPos, attackDirection) {
    const attack = new Attacks();
    attack.position = [...userPos];
    switch (attackDirection) {
      case "Up":
        attack.position[1] -= 1;
        break;
      case "Down":
        attack.position[1] += 1;
        break;
      case "Left":
        attack.position[0] -= 1;
        break;
      case "Right":
        attack.position[0] += 1;
        break;
    }
  }
  getAttacks() {
    return Attacks.getAttacks();
  }
  GameLoop() {
    this.socket.emit("move", Enemies.getPositions());
    const enemies = Enemies.getEnemies();

    //Remove any dead enemies and tell the client to replace them will skulls
    //once the enemy is dead- set a timeout to create a new enemy
    const deadEnemies = Enemies.getDeadInstances();
    for (let i of deadEnemies) {
      this.socket.emit("removeDead", i.name);
      setTimeout(() => {
        let newGoblin = new Enemies();
      }, 3000 + Math.random() * 2000);
      //this.socket.broadcast.emit("removeDead", i.name);
    }
    Enemies.deadInstances = [];
    const attacks = this.getAttacks();
    for (let i of enemies) {
      i.checkHit();
    }

    //Handle the random movement of the Enemies
    for (let i of enemies) {
      //some hardcoded nonsense
      //TODO: write TODO
      i.moveTime -= 500;
      if (i.moveTime <= 0) {
        i.moveTime = i.defaultMoveTime;
        let rX = Math.floor(Math.random() * 3) - 1;
        let rY = Math.floor(Math.random() * 3) - 1;
        i.move(rX, rY);
      }
    }
    for (let i of attacks) {
      i.timeToLive -= 1;
      if (i.timeToLive <= 0) {
        i.destroy();
      }
    }
  }
}
module.exports.Game = Game;
