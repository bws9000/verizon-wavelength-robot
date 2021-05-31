import Client from "./js/Client.js";
import VerizonDisplay from "./js/VerizonDisplay.js";

let ip = '54.205.23.184';
//let ip = 'localhost';

const client = new Client(
  new WebSocket("ws://" + ip + ":3001/"),
  new VerizonDisplay(document),
  false,
  false
);
document.addEventListener('click', function (e) {
  let x = e.target.id.charAt(0);
  let y = e.target.id.charAt(1);
  client.sendPosition(x, y);

  if (e.target.id === 'activateCommand') {
    client.activateCommand();
  }
}, false);

