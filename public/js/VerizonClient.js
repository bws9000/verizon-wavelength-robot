class VerizonClient {
  constructor(ws) {
    this.ws = ws;

    ws.onopen = () => {
      console.log('hi vclient');
      var message = { message: "hello vclient" };
      this.ws.send(JSON.stringify(message));
    };

    ws.onmessage = function (e) {
      console.log(e.data);
    };

    // setInterval(() => {
    //   let msg = { message: "give me data" };
    //   ws.send(JSON.stringify(msg)); //heartbeat
    //   display.test++;
    //   display.updateDisplay();
    // }, 500);
  }
  sendPosition(x, y) {
    let msg = { "type": "position-click", "x": x, "y": y };
    this.ws.send(JSON.stringify(msg));
  }
}
export default VerizonClient;
