"use strict";

import express from "express";
import ws from "ws";
import Robot from "./wsdata/RobotData";

const port = 9898;
const clients = [];
const robot = new Robot();
const app = express();

app.use(express.static("public"));
const wss = new ws.Server({ noServer: true });

wss.on('connection', (conn) => {
  conn.on("message", function (message) {
    robot.recieved(message);
    wss.clients.forEach(function each(client) {
      if (client !== wss && client.readyState === ws.OPEN) {
        conn.send(robot.sendObjectToDisplay());
      }
    });
  });
});

function isActive() {
  if (!robot.active) console.log("activate me");
  return robot.active;
}
function checkBounds(x, y) {
  if (x < 0 || y < 0) return false;
  if (x > robot.bounds || y > robot.bounds) return false;
  return true;
}
function robotMove(x, y) {
  if (!isActive()) return;
  if (checkBounds(x, y)) {
    robot.Position = { x: x, y: y };
  } else {
    console.log("out of bounds");
  }
}
function robotCommand(command) {
  let x = robot.Position.x;
  let y = robot.Position.y;
  let xpos = 0;
  let ypos = 0;

  switch (command) {
    case "activate":
      robot.active = true;
      robot.Position = { x: 0, y: 0 };
      console.log("Robot Activated. ( refresh browser at localhost:3000 )");
      break;
    case "move up":
      ypos = y + 1;
      robotMove(x, ypos);
      break;
    case "move down":
      ypos = y - 1;
      robotMove(x, ypos);
      break;
    case "move left":
      xpos = x - 1;
      robotMove(xpos, y);
      break;
    case "move right":
      xpos = x + 1;
      robotMove(xpos, y);
      break;
    default:
      console.log("\ni don't understand,");
      console.log("here's a list of commands:");
      console.log("activate \nmove (up,down,left,right)");
  }
}
const stdin = process.openStdin();
stdin.addListener("data", (nugget) => {
  let data = nugget.toString().trim();
  robotCommand(data);
});

const server = app.listen(port, () => console.log(`listening on port ${port}`));
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});
