class Client {
  test;
  constructor(ws, display, log, commandline) {

    this.commandline = commandline;
    this.display = display;
    this.log = log;
    this.ws = ws;
    this.display;
    this.test = false;

    ws.onopen = () => {
      var message = { message: "ws connected." };
      this.ws.send(JSON.stringify(message));
    };

    let that = this;
    //to browser ws
    ws.onmessage = async function (msg) {
      let robot = JSON.parse(msg.data);

      this.robotTestObstacleX = robot.testObstacle.x;
      this.robotTestObstacleY = robot.testObstacle.y;

      display.clear();

      if (robot.active) {
        let x = robot.Position.x;
        let y = robot.Position.y;
        display.activateBlock(x, y);
      }

      if (robot.commandResponse !== '' || robot.commandResponse === undefined) {
        alert(robot.commandResponse);
        if (robot.commandResponse === 'Starting Test') {
          console.log('start test');
          this.test = true;
          new TestOne(this, display);
        }
      }
      //console.log('msg: ' + msg.data);
    };

    if (this.commandline) {
      setInterval(() => {
        let msg = { message: "give me data" };
        ws.send(JSON.stringify(msg)); //heartbeat
        display.test++;
        display.updateDisplay();
      }, 500);
    }

  }

  activateCommand() {
    let msg = { "type": "activate-robot" }
    this.ws.send(JSON.stringify(msg));
  }
  checkActiveForTestAndRun() {
    let msg = { "type": "check-active-robot-for-test" }
    this.ws.send(JSON.stringify(msg));
  }

  sendPosition(x, y) {
    if (!this.commandline) {
      let msg = { "type": "position-click", "x": x, "y": y };
      this.ws.send(JSON.stringify(msg));
      this.display.test++;
      this.display.updateDisplay();
    }
  }
}
export default Client;


class TestOne {

  constructor(ws, display) {
    this.display = display;
    this.ws = ws;
    this.robot;
    this.position_x = 0;
    this.position_y = 4;
    this.count = 0;
    this.collision = false;
    this.collisionSet = false;
    this.collisionMessage = {};

    var that = this;
    new Promise(resolve => {
      this.ws.onmessage = async function (msg) {
        that.robot = JSON.parse(msg.data);
        let message = JSON.parse(that.robot.message);
        if (message.collision !== undefined &&
          !that.collisionSet) {
          that.collision = true;
          that.collisionSet = true;
          that.collisionMessage = message;
        }
        resolve(true);
      }
    }).then(() => {
      this.startTestOne(display, ws);
    })
    ws.send('{"start":"the-test"}');
  }

  async startTestOne(display, ws) {
    this.collisionSet = false;

    var _x, _y, avoid_x = 0, avoid_y = 4;
    for (let i = 4; i > -1; i--) {
      for (let j = 0; j < 5; j++) {

        _x = j;
        _y = i;

        if (_x === 0 && _y < 4) {
          avoid_x = 4;
          avoid_y = _y + 1;
        } else {
          avoid_x = _x - 1;
          avoid_y = _y;
        }

        if (this.collision) {
          this.collision = false;
          alert('collision at [' + this.collisionMessage.collision.x + ',' + this.collisionMessage.collision.y + ']');
        }

        if (this.robot.testObstacle.y === _y.toString() &&
          this.robot.testObstacle.x === _x.toString()) {
          alert('Collision Averted at ' + avoid_x + '' + avoid_y);
        } else {
          await move(_x, _y, true);
        }
        this.count++;
        if (this.count === 25) {
          this.count = 0;
          let msg = { "type": "reset-obstacle-xy" }
          this.ws.send(JSON.stringify(msg));
        }
      }
    }

    this.startTestOne(display, ws);

    async function move(y, x, activate_client) {
      await wait();
      display.clear();
      display.activateBlock(y, x);
      let msg = { "type": "position-click", "x": y, "y": x };
      if (activate_client) ws.send(JSON.stringify(msg));
    }

    function wait() {
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
    }
  }
}

    // var that = this;
    // this.ws.onmessage = async function (msg) {
    //   //that.robot = JSON.parse(msg.data);
    //   let robot = JSON.parse(msg.data);
    //   if (robot.testOne === undefined) {
    //     that.startTestOne(robot, that.display, that.ws);
    //   }
    // }
    // this.ws.send('{"start-test":"testOne"}');



  // async startTestOne(robot, display, ws) {

  //   console.log('collision x: ' + robot.testObstacle.x);
  //   console.log('collision y: ' + robot.testObstacle.y);

  //   if (!this.started) {
  //     await move(this.position_x, this.position_y); //start
  //     this.started = true;
  //     this.count++;
  //   } else {
  //     this.position_x++;
  //     if (this.position_x > 4) {
  //       this.position_x = 0;
  //       this.position_y--;
  //     }
  //     this.count++;
  //     if (this.count === 26) {
  //       this.count = 0;
  //       this.position_x = 0;
  //       this.position_y = 4;
  //     }
  //     move(this.position_x, this.position_y);
  //   }

  //   async function move(x, y) {
  //     await wait();
  //     let msg = { "type": "position-click", "x": x, "y": y };
  //     ws.send(JSON.stringify(msg));
  //     display.clear();
  //     display.activateBlock(x, y);
  //   }

  //   function wait() {
  //     return new Promise(resolve => {
  //       setTimeout(resolve, 1000);
  //     });
  //   }
