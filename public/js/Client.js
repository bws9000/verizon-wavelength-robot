class Client {
  constructor(ws, display, log, commandline) {
    this.commandline = commandline;
    this.display = display;
    this.log = log;
    this.ws = ws;
    this.display;


    ws.onopen = () => {
      var message = { message: "ws connected." };
      this.ws.send(JSON.stringify(message));
    };

    //to browser ws
    ws.onmessage = function (msg) {
      let robot = JSON.parse(msg.data);
      display.clear();

      if (robot.active) {
        let x = robot.Position.x;
        let y = robot.Position.y;
        display.activateBlock(x, y);
      }
      if (robot.commandResponse !== '') {
        alert(robot.commandResponse);
      }

      console.log('msg: ' + msg.data);

    };

    if (this.commandline) {
      setInterval(() => {
        let msg = { message: "give me data" };
        ws.send(JSON.stringify(msg)); //heartbeat
        display.test++;
        display.updateDisplay();
      }, 500);
    }

    this.dev();
  }

  activateCommand() {
    let msg = { "type": "activate-robot" }
    let response = this.ws.send(JSON.stringify(msg));
  }

  sendPosition(x, y) {
    if (!this.commandline) {
      let msg = { "type": "position-click", "x": x, "y": y };
      this.ws.send(JSON.stringify(msg));
      this.display.test++;
      this.display.updateDisplay();
    }
  }

  dev() {
    if (this.log) {
      console.log(this.ws);
    }
  }
}
export default Client;
