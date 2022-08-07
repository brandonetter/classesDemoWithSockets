class Rooms {
  static rooms = [];
  constructor(name, exitPos, enterPos, connectTo) {
    this.name = name;
    this.exitPos = exitPos;
    this.enterPos = enterPos;
    this.connectTo = connectTo;
    Rooms.rooms.push(this);
  }
  static getRoomByName(name) {
    for (let i of Rooms.rooms) {
      if (i.name === name) {
        return i;
      }
    }
  }
  static getRooms() {
    return Rooms.rooms;
  }
}
module.exports.Rooms = Rooms;
