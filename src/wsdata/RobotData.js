'use strict';

export default class Robot {

  constructor() {
    this.obj = {};
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
    return JSON.stringify(this.obj);
  }

}