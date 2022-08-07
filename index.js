const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const { Game } = require("./classes/game");
const { Rooms } = require("./classes/rooms");

//50 is the ms until the game updates state. io is the socket server
const GameController = new Game(50, io);
//init starts the gameloop and handles enemy states/attack states
GameController.init();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index2.html"));
});

//User info is held inside of the socket object associated with that connection.
//As such: all the user logic is handled here in the index.js
io.on("connection", (socket) => {
  GameController.setRooms();
  console.log("a user connected");
  const users = [];
  socket.position = [5, 5];
  socket.room = 0;
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      position: socket.position,
      room: socket.room,
    });
  }
  socket.emit("users", users);
  socket.on("moveKey", (message) => {
    switch (message) {
      case "a":
        socket.position[0] -= 1;
        break;
      case "d":
        socket.position[0] += 1;
        break;
      case "w":
        socket.position[1] -= 1;
        break;
      case "s":
        socket.position[1] += 1;
        break;
    }
    //Keep user in bounds
    if (socket.position[0] < -10) socket.position[0] = -10;
    if (socket.position[0] > 10) socket.position[0] = 10;
    if (socket.position[1] < -10) socket.position[1] = -10;
    if (socket.position[1] > 10) socket.position[1] = 10;

    //Check Exit
    let currentRoom = Rooms.getRoomByName(socket.room);
    console.log(currentRoom);
    if (
      socket.position[0] === currentRoom.exitPos[0] &&
      socket.position[1] === currentRoom.exitPos[1]
    ) {
      let nextRoom = Rooms.getRoomByName(currentRoom.connectTo);
      socket.room = currentRoom.connectTo;
      socket.position[0] = nextRoom.enterPos[0];
      socket.position[1] = nextRoom.enterPos[1];
    }
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        position: socket.position,
        room: socket.room,
      });
    }
    socket.emit("users", users);
    socket.broadcast.emit("users", users);
    console.log(socket.id, message, socket.position);
  });
  socket.on("attackKey", (message) => {
    switch (message) {
      case "ArrowUp":
        GameController.createAttack(socket.position, "Up");
        break;
      case "ArrowDown":
        GameController.createAttack(socket.position, "Down");
        break;
      case "ArrowLeft":
        GameController.createAttack(socket.position, "Left");
        break;
      case "ArrowRight":
        GameController.createAttack(socket.position, "Right");
        break;
    }
    socket.emit("attacks", GameController.getAttacks());
    socket.broadcast.emit("attacks", GameController.getAttacks());
    console.log(socket.id, message, socket.position);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:80");
});
