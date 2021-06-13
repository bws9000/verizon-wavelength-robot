'use strict';

export default class Robot {

  constructor() {
    this.testObstacle = {
      x: -1,
      y: -1
    };
    // this.collision = {
    //   x: -1,
    //   y: -1
    // };
    this.obj = {};
    this.active = false;
    this.message = '';
    this.active = false;
    this.testRandom = Math.floor(Math.random() * 25);
    this.gridBlock = 0;
    this.bounds = 4;
    this.Position = {
      x: 0,
      y: 0
    }
    this.commandResponse = '';
    this.x = 99;
  }

  recieved(msg) {

    this.message = msg;
    this.commandResponse = '';

    let command = JSON.parse(msg);

    if (command.type === 'position-click') {
      this.Position = {
        x: command.x,
        y: command.y
      }
    }
    if (command.type === 'activate-robot') {
      this.active = true;
      this.Position = {
        x: 0,
        y: 0
      }
      this.commandResponse = "robot control activated";
    }
    if (command.type === 'check-active-robot-for-test') {
      this.commandResponse = (this.active) ? 'Starting Test' : 'Activate First';
    }
    if (command.type === 'set-obstacle-from-android') {
      this.testObstacle = command.xy;
    }
    if (command.type === 'reset-obstacle-xy') {
      this.testObstacle.x = -1;
      this.testObstacle.y = -1;
    }
    // if (command.type === 'collision') {
    //   this.collision = command.xy;
    //   this.commandResponse = "collision at " + JSON.stringify(this.collision);
    // }
    return this.message;
  }
  sendString() {
    return this.message;
  }
  sendObjectToDisplay() {
    this.obj.active = this.active;
    this.obj.message = this.message;
    this.obj.activeArea = this.testRandom;
    this.obj.Position = this.Position;
    this.obj.gridBlock = this.gridBlock;
    this.obj.bounds = this.bounds;
    this.obj.commandResponse = this.commandResponse;
    this.obj.x = this.x;
    this.obj.testObstacle = this.testObstacle;
    return JSON.stringify(this.obj);
  }

}